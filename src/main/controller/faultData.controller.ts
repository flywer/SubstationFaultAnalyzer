import {Controller, IpcHandle} from "einf";
import {channels} from "@render/api/channels";
import * as ExcelJS from "exceljs";
import {dialog} from "electron";
import {failure, success} from "@main/vo/resultVo";
import log from "electron-log";
import {AppDataSource} from "@main/dataSource/app-data-source";
import {Substation} from "@main/entity/Substation";
import {Interval} from "@main/entity/Interval";
import {ProAct} from "@main/entity/ProAct";
import {SwitchPos} from "@main/entity/SwitchPos";
import {PageVo} from "@common/types/page.types";

type PageVoAlias = PageVo

@Controller()
export class FaultDataController {
    constructor() {
    }

    @IpcHandle(channels.faultData.importByExcel)
    public handleImportByExcel() {

        const templateCheck = (worksheet: ExcelJS.Worksheet) => {
            return new Promise((resolve, reject) => {
                if (worksheet.getCell('A2').text != '变电站' ||
                    worksheet.getCell('B2').text != '间隔' ||
                    worksheet.getCell('C2').text != '保护动作信息' ||
                    worksheet.getCell('D2').text != '开关变位信息'
                ) {
                    reject(failure('导入失败原因：表头错误\n详情：第二行表头应依次为：变电站、间隔、保护动作信息、开关变位信息'))
                }


                resolve(success())
            })
        }

        return new Promise<any>(async (resolve) => {
            dialog.showOpenDialog({
                title: '选择待导入文件',
                properties: ['openFile'],
                buttonLabel: '导入',
                filters: [
                    {
                        name: 'Excel',
                        extensions: ['xlsx', 'xls']
                    }
                ]
            })
                .then(async result => {
                    if (!result.canceled) {
                        try {
                            const workbook: ExcelJS.Workbook = new ExcelJS.Workbook();
                            await (workbook.xlsx as ExcelJS.Xlsx).readFile(result.filePaths[0]);

                            workbook.eachSheet((worksheet: ExcelJS.Worksheet) => {
                                templateCheck(worksheet).then(async () => {

                                    const rowData = []

                                    worksheet.eachRow({includeEmpty: true}, async (row: ExcelJS.Row, rowNumber: number) => {
                                        if (rowNumber > 2) {
                                            rowData.push({
                                                substationName: row.getCell(1).text,
                                                intervalName: row.getCell(2).text,
                                                proActName: row.getCell(3).text,
                                                switchPosName: row.getCell(4).text
                                            })
                                        }
                                    })

                                    for (const {substationName, intervalName, proActName, switchPosName} of rowData) {

                                        let substation = await AppDataSource.getRepository(Substation).findOneBy({substationName: substationName});
                                        // 如果变电站不存在，则创建新的变电站实体
                                        if (!substation) {
                                            substation = new Substation();
                                            substation.substationName = substationName;
                                            await AppDataSource.manager.save(substation);
                                        }


                                        let interval = await AppDataSource.getRepository(Interval).findOneBy({intervalName: intervalName});
                                        if (!interval) {
                                            // 创建新的间隔实体并关联变电站
                                            interval = new Interval();
                                            interval.intervalName = intervalName;
                                            interval.substation = substation;
                                            await AppDataSource.manager.save(interval);
                                        }

                                        let proAct = await AppDataSource.getRepository(ProAct).findOneBy({proActName: proActName});
                                        if (!proAct) {
                                            // 创建新的间隔实体并关联变电站
                                            proAct = new ProAct();
                                            proAct.proActName = proActName;
                                            proAct.interval = interval;
                                            await AppDataSource.manager.save(proAct);
                                        }

                                        let switchPos = await AppDataSource.getRepository(SwitchPos).findOneBy({switchPosName: switchPosName});
                                        if (!switchPos) {
                                            // 创建新的间隔实体并关联变电站
                                            switchPos = new SwitchPos();
                                            switchPos.switchPosName = switchPosName;
                                            switchPos.interval = interval;
                                            await AppDataSource.manager.save(switchPos);
                                        }
                                    }

                                    resolve(success('数据导入成功'))

                                }).catch(error => {
                                    resolve(error)
                                })
                            })

                        } catch (e) {
                            log.error(e)
                            resolve(failure('文件读取失败，查看文件是否加密'))
                        }

                    }
                })
        })

    }

    @IpcHandle(channels.faultData.findFaultDataByPage)
    public async handleFindFaultDataByPage(pageParams: PageVoAlias) {




    }
}
