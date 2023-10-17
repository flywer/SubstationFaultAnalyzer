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
import {join} from "path";
import fs from "fs";
import {APP_RESOURCE_PATH} from "../../constants/app";
import {readFsSync} from "@common/utils/fsUtils";
import {isEmpty} from "lodash";
import {FaultSaveModel} from "@common/types/faultData.types";

type PageVoAlias = PageVo
type FaultSaveModelAlias = FaultSaveModel

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

                                        let substation = await AppDataSource.getRepository(Substation).findOneBy(
                                            {
                                                substationName: substationName
                                            });
                                        // 如果变电站不存在，则创建新的变电站实体
                                        if (!substation) {
                                            substation = new Substation();
                                            substation.substationName = substationName;
                                            await AppDataSource.manager.save(substation);
                                        }


                                        let interval = await AppDataSource.getRepository(Interval).findOneBy(
                                            {
                                                intervalName: intervalName,
                                                substation: {
                                                    id: substation.id
                                                }
                                            });
                                        if (!interval) {
                                            // 创建新的间隔实体并关联变电站
                                            interval = new Interval();
                                            interval.intervalName = intervalName;
                                            interval.substation = substation;
                                            await AppDataSource.manager.save(interval);
                                        }

                                        let proAct = await AppDataSource.getRepository(ProAct).findOneBy({
                                            proActName: proActName,
                                            interval: {
                                                id: interval.id
                                            }
                                        });
                                        if (!proAct) {
                                            // 创建新的间隔实体并关联变电站
                                            proAct = new ProAct();
                                            proAct.proActName = proActName;
                                            proAct.interval = interval;
                                            await AppDataSource.manager.save(proAct);
                                        }

                                        let switchPos = await AppDataSource.getRepository(SwitchPos).findOneBy({
                                            switchPosName: switchPosName,
                                            interval: {
                                                id: interval.id
                                            }
                                        });
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
        console.log(pageParams)
    }

    @IpcHandle(channels.faultData.downloadTemplate)
    public handleDownloadTemplate() {
        return new Promise((resolve) => {
            dialog.showSaveDialog({
                title: '选择文件保存位置',
                filters: [{
                    name: 'xlsx',
                    extensions: ['xlsx']
                }],
                defaultPath: '变电站故障数据导入模板'
            }).then(res => {
                if (!res.canceled) {
                    const filePath = join(APP_RESOURCE_PATH, '/assets/excelTemplate/faultDataImportTemplate.xlsx')
                    const buffer = readFsSync(filePath)
                    if (buffer == null || isEmpty(buffer.toString())) {
                        resolve(failure('模板不存在，请联系开发者'))
                    } else {
                        fs.writeFileSync(res.filePath, buffer);
                        resolve(success('下载成功'))
                    }
                }
            })
        })
    }

    @IpcHandle(channels.faultData.saveFaultData)
    public async handleSaveFaultData(model: FaultSaveModelAlias) {

        try {
            let substation = await AppDataSource.getRepository(Substation).findOneBy({substationName: model.substationName});
            // 如果变电站不存在，则创建新的变电站实体
            if (!substation) {
                substation = new Substation();
                substation.substationName = model.substationName;
                await AppDataSource.manager.save(substation);
            }

            let interval = await AppDataSource.getRepository(Interval).findOneBy({
                intervalName: model.intervalName,
                substation: {
                    id: substation.id
                }
            });
            if (!interval) {
                // 创建新的间隔实体并关联变电站
                interval = new Interval();
                interval.intervalName = model.intervalName;
                interval.substation = substation;
                await AppDataSource.manager.save(interval);
            }

            if (model.faultType == 1) {
                let proAct = await AppDataSource.getRepository(ProAct).findOneBy({
                    proActName: model.faultName,
                    interval: {
                        id: interval.id
                    }
                });
                if (!proAct) {
                    // 创建新的间隔实体并关联变电站
                    proAct = new ProAct();
                    proAct.id = model.faultId
                    proAct.proActName = model.faultName;
                    proAct.interval = interval;
                    await AppDataSource.manager.save(proAct);
                }

            } else {
                let switchPos = await AppDataSource.getRepository(SwitchPos).findOneBy({
                    switchPosName: model.faultName,
                    interval: {
                        id: interval.id
                    }
                });
                if (!switchPos) {
                    // 创建新的间隔实体并关联变电站
                    switchPos = new SwitchPos();
                    switchPos.id = model.faultId
                    switchPos.switchPosName = model.faultName;
                    switchPos.interval = interval;
                    await AppDataSource.manager.save(switchPos);
                }
            }

            return success('保存成功')
        } catch (e) {
            log.error(e)
            return failure(`保存失败,${e}`)
        }
    }

    @IpcHandle(channels.faultData.deleteFaultData)
    public async handleDeleteFaultData(faultType: number, faultId: number) {
        try {
            if (faultType == 1) {
                await AppDataSource.getRepository(ProAct).delete(faultId)
            } else if (faultType == 2) {
                await AppDataSource.getRepository(SwitchPos).delete(faultId)
            }

            return success('删除成功')
        } catch (e) {
            log.error(e)
            return success(`删除失败,${e}`)
        }

    }
}



