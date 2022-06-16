import ApiService from './ApiService';
import StorageService from './StorageService';
import * as AppError from '~src/constants/AppError';
import DataPersister from '~src/utils/DataPersister';

// Data history
// key for saving individual response for each api, the name should match the data_type from staticDataUpdateHistoryList
const KEY_DATA_TYPE_BRANCH = 'Branch';
const KEY_DATA_TYPE_BRANCH_DISTRICT = 'BranchDistrict';
const KEY_DATA_TYPE_BRANCH_FEATURE = 'BranchFeature';
const KEY_DATA_TYPE_BRANCH_OPEN_HOURS = 'BranchOpeningHours';
const KEY_DATA_TYPE_CRITICAL_NOTICE = 'CriticalNotice';
const KEY_DATA_TYPE_IMPORTANT_NOTICE = 'ImportantNotice';
const KEY_DATA_TYPE_BRANCH_SUB_DISTRICT = 'BranchSubDistrict';

// key for saving last update time from staticDataUpdateHistoryList, will use "data_type + _TS"
const KEY_LAST_UPDATE_TS_BRANCH_LIST = 'Branch_LAST_UPDATE_TS';
const KEY_LAST_UPDATE_TS_BRANCH_DISTRICT = 'BranchDistrict_LAST_UPDATE_TS';
const KEY_LAST_UPDATE_TS_BRANCH_FEATURE = 'BranchFeature_LAST_UPDATE_TS';
const KEY_LAST_UPDATE_TS_BRANCH_OPEN_HOURS =
  'BranchOpeningHours_LAST_UPDATE_TS';
const KEY_LAST_UPDATE_TS_CRITICAL_NOTICE = 'CriticalNotice_LAST_UPDATE_TS';
const KEY_LAST_UPDATE_TS_IMPORTANT_NOTICE = 'ImportantNotice_LAST_UPDATE_TS';
const KEY_LAST_UPDATE_TS_BRANCH_SUB_DISTRICT =
  'BranchSubDistrict_LAST_UPDATE_TS';

// Version History
// key for saving individual response for each api, the name should match the data_type from staticDataVersionHistoryList
const KEY_DATA_TYPE_TNC = 'TermsAndConditionsVersion';

// key for saving the version from staticDataVersionHistoryList, will use "data_type + _VERSION_NUMBER"
export const KEY_VERSION_TNC = 'TermsAndConditionsVersion_VERSION_NUMBER';
const KEY_DATA_TYPE_APP_TNC = 'MobileAppTnCVersion';
const KEY_VERSION_APP_TNC = 'MobileAppTnCVersion_VERSION_NUMBER';

class _DataUpdateService {
  constructor() {}

  async getAllData() {
    console.log('DataUpdateService -> getAllData');
    try {
      // get server data version & last update timestamp first
      let dataHistoryResult = await this.getDataHistory();
      if (dataHistoryResult === AppError.SUCCESS) {
        console.log('DataUpdateService -> getAllData -> getDataHistory:');
        // get all other data one by one
        const [
          branchList,
          branchDistrict,
          branchFeature,
          branchOpeningHours,
          criticalNotice,
          importantNotice,
          // tnc,
          // appTnc,
          branchSubDistrict,
        ] = await Promise.all([
          this.getBranchList(),
          this.getBranchDistrict(),
          this.getBranchFeature(),
          this.getBranchOpeningHours(),
          this.getCriticalNotice(),
          this.getImportantNotice(),
          // this.getTNC(),
          // this.getAppTNC(),
          this.getBranchSubDistrict(),
        ]);
        if (
          branchList &&
          branchDistrict &&
          branchFeature &&
          branchOpeningHours &&
          criticalNotice &&
          importantNotice &&
          // tnc &&
          // appTnc &&
          branchSubDistrict
        ) {
          // console.log('DataUpdateService -> getAllData -> tnc:', this.tnc);
          // console.log(
          //   'DataUpdateService -> getAllData -> appTnc:',
          //   this.appTnc,
          // );
          console.log('DataUpdateService -> getAllData -> success');
          return AppError.SUCCESS;
        }
      }
    } catch (error) {
      console.log(`getAllData Error: ${error}`);
      throw error;
    }
  }

  async getBranchList() {
    if (this.branchList) {
      return this.branchList;
    } else {
      try {
        this.branchList = await this.getData(
          KEY_DATA_TYPE_BRANCH,
          KEY_LAST_UPDATE_TS_BRANCH_LIST,
        );
        return this.branchList;
      } catch (error) {
        console.log(`getBranchList() Error: ${error}`);
        throw error;
      }
    }
  }

  async getBranchDistrict() {
    if (this.branchDistrict) {
      return this.branchDistrict;
    } else {
      try {
        this.branchDistrict = await this.getData(
          KEY_DATA_TYPE_BRANCH_DISTRICT,
          KEY_LAST_UPDATE_TS_BRANCH_DISTRICT,
        );
        return this.branchDistrict;
      } catch (error) {
        throw error;
      }
    }
  }

  async getBranchSubDistrict() {
    if (this.branchSubDistrict) {
      return this.branchSubDistrict;
    } else {
      try {
        this.branchSubDistrict = await this.getData(
          KEY_DATA_TYPE_BRANCH_SUB_DISTRICT,
          KEY_LAST_UPDATE_TS_BRANCH_SUB_DISTRICT,
        );
        return this.branchSubDistrict;
      } catch (error) {
        throw error;
      }
    }
  }

  async getBranchFeature() {
    if (this.branchFeature) {
      return this.branchFeature;
    } else {
      try {
        this.branchFeature = await this.getData(
          KEY_DATA_TYPE_BRANCH_FEATURE,
          KEY_LAST_UPDATE_TS_BRANCH_FEATURE,
        );
        return this.branchFeature;
      } catch (error) {
        throw error;
      }
    }
  }

  async getBranchOpeningHours() {
    if (this.branchOpeningHours) {
      return this.branchOpeningHours;
    } else {
      try {
        this.branchOpeningHours = await this.getData(
          KEY_DATA_TYPE_BRANCH_OPEN_HOURS,
          KEY_LAST_UPDATE_TS_BRANCH_OPEN_HOURS,
        );
        return this.branchOpeningHours;
      } catch (error) {
        throw error;
      }
    }
  }

  async getCriticalNotice() {
    if (this.criticalNotice) {
      return this.criticalNotice;
    } else {
      try {
        this.criticalNotice = await this.getData(
          KEY_DATA_TYPE_CRITICAL_NOTICE,
          KEY_LAST_UPDATE_TS_CRITICAL_NOTICE,
        );
        return this.criticalNotice;
      } catch (error) {
        throw error;
      }
    }
  }

  async getImportantNotice() {
    if (this.importantNotice) {
      return this.importantNotice;
    } else {
      try {
        this.importantNotice = await this.getData(
          KEY_DATA_TYPE_IMPORTANT_NOTICE,
          KEY_LAST_UPDATE_TS_IMPORTANT_NOTICE,
        );
        return this.importantNotice;
      } catch (error) {
        throw error;
      }
    }
  }

  async getDataHistory() {
    if (this.lastUpdateTsResponse && this.dataVersionResponse) {
      return AppError.SUCCESS;
    }
    try {
      // const [lastUpdateTsResponse, dataVersionResponse] = await Promise.all([
      //   ApiService.getStaticDataUpdateHistoryList(),
      //   ApiService.getStaticDataVersionHistoryList(),
      // ]);
      const lastUpdateTsResponse = await ApiService.getStaticDataUpdateHistoryList();

      console.log(
        `lastUpdateTsResponse2: ${JSON.stringify(lastUpdateTsResponse)}`,
      );
      this.lastUpdateTsResponse = lastUpdateTsResponse;
      // this.dataVersionResponse = [];
      if (
        this.lastUpdateTsResponse
        // && this.dataVersionResponse
      ) {
        return AppError.SUCCESS;
      } else {
        return AppError.APP_API_ERROR;
      }
    } catch (error) {
      throw error;
    }
  }

  async forceGetDataHistory() {
    try {
      const [lastUpdateTsResponse, dataVersionResponse] = await Promise.all([
        ApiService.getStaticDataUpdateHistoryList(),
        ApiService.getStaticDataVersionHistoryList(),
      ]);

      this.lastUpdateTsResponse = lastUpdateTsResponse;
      this.dataVersionResponse = dataVersionResponse;
      if (this.lastUpdateTsResponse && this.dataVersionResponse) {
        return AppError.SUCCESS;
      } else {
        return AppError.APP_API_ERROR;
      }
    } catch (error) {
      throw error;
    }
  }

  async resetReadStatus(dataType) {
    switch (dataType) {
      case KEY_DATA_TYPE_CRITICAL_NOTICE:
        await StorageService.setIsViewedCriticalNotice(false);
        break;
      case KEY_DATA_TYPE_IMPORTANT_NOTICE:
        await StorageService.setIsViewedImportantNotices(false);
        break;
      case KEY_DATA_TYPE_TNC:
        await StorageService.setIsViewedTNC(false);
        break;
      default:
        break;
    }
  }

  async getDataApiByType(dataType) {
    try {
      switch (dataType) {
        case KEY_DATA_TYPE_BRANCH:
          return await ApiService.getBranchList();
        case KEY_DATA_TYPE_BRANCH_DISTRICT:
          return await ApiService.getBranchDistrictList();
        case KEY_DATA_TYPE_BRANCH_SUB_DISTRICT:
          return await ApiService.getBranchSubDistrictList();
        case KEY_DATA_TYPE_BRANCH_FEATURE:
          return await ApiService.getBranchFeatureList();
        case KEY_DATA_TYPE_BRANCH_OPEN_HOURS:
          return await ApiService.getBranchWorkingHoursList();
        case KEY_DATA_TYPE_CRITICAL_NOTICE:
          return await ApiService.getActiveCriticalNotice();
        case KEY_DATA_TYPE_IMPORTANT_NOTICE:
          return await ApiService.getImportantNoticeList();
        default:
          break;
      }
    } catch (error) {
      console.log(
        'DataUpdateService -> getDataApiByType(dataType)',
        'catch error dataType:',
        dataType,
        '-> catch error: ',
        error,
      );
      throw error;
    }
  }

  // 1. Get last update time list from server, e.g. staticDataVersionHistoryList
  // 2. check if saved  last update time is older than server,
  // 3. if yes, call specific api to get data and save it in locally using dataType as key
  // 4. if no, return saved data
  async getData(dataType, keyDataTypeTs) {
    console.log(
      'DataUpdateService -> getData -> dataType: ',
      dataType,
      ' keyDataTypeTs:',
      keyDataTypeTs,
    );
    try {
      if (!this.lastUpdateTsResponse) {
        await this.getDataHistory();
      }

      if (this.lastUpdateTsResponse) {
        let lastUpdateDataList = this.lastUpdateTsResponse
          .staticDataUpdateHistoryList;
        let serverLastUpdateTs;
        lastUpdateDataList.forEach((obj, index, array) => {
          if (obj.dataType === dataType) {
            serverLastUpdateTs = obj.lastUpdateDateTime;
          }
        });

        let savedLastUpdateTs = await DataPersister.getString(keyDataTypeTs);

        let needUpdate = false;
        if (!savedLastUpdateTs) {
          needUpdate = true;
        } else {
          let serverTsDate = Date.parse(serverLastUpdateTs);
          let savedTsDate = Date.parse(savedLastUpdateTs);

          console.log(
            'DataUpdateService -> getData',
            ' dataType:',
            dataType,
            '-> serverTsDate: ',
            serverTsDate,
          );
          console.log(
            'DataUpdateService -> getData',
            ' dataType:',
            dataType,
            '-> savedTsDate: ',
            savedTsDate,
          );

          if (serverTsDate > savedTsDate) {
            needUpdate = true;
          }
        }
        console.log(
          'DataUpdateService -> getData',
          ' dataType:',
          dataType,
          '-> needUpdate: ',
          needUpdate,
        );
        if (needUpdate) {
          let dataListResponse = await this.getDataApiByType(dataType);
          if (dataListResponse) {
            await this.resetReadStatus(dataType);
            console.log(
              `2 DataPersister.setString, dataType: ${dataType}, dataListResponse: ${JSON.stringify(
                dataListResponse,
              )}`,
            );
            await DataPersister.setString(
              keyDataTypeTs,
              dataListResponse.lastUpdateDateTime,
            );
            await DataPersister.setJson(dataType, dataListResponse);
            return dataListResponse;
          }
        } else {
          let dataList = await DataPersister.getJson(dataType);
          return dataList;
        }
      } else {
        return AppError.APP_API_ERROR;
      }
    } catch (error) {
      console.log(
        'DataUpdateService -> getData',
        'catch error dataType:',
        dataType,
        '-> catch error: ',
        error,
      );
      throw error;
    }
  }

  async getTNC() {
    if (this.tnc) {
      return this.tnc;
    } else {
      try {
        this.tnc = await this.getVersionData(
          KEY_DATA_TYPE_TNC,
          KEY_VERSION_TNC,
        );
        return this.tnc;
      } catch (error) {
        throw error;
      }
    }
  }

  async forceGetTNC() {
    try {
      this.tnc = await this.getVersionData(KEY_DATA_TYPE_TNC, KEY_VERSION_TNC);
      return this.tnc;
    } catch (error) {
      throw error;
    }
  }

  async getAppTNC() {
    if (this.appTnc) {
      return this.appTnc;
    } else {
      try {
        this.appTnc = await this.getVersionData(
          KEY_DATA_TYPE_APP_TNC,
          KEY_VERSION_APP_TNC,
        );
        return this.appTnc;
      } catch (error) {
        throw error;
      }
    }
  }

  async getDataVersionApiByTypeAndVersion(dataType, version) {
    try {
      switch (dataType) {
        case KEY_DATA_TYPE_TNC:
          return await ApiService.getTermsAndConditionsByVersion(version);
        case KEY_DATA_TYPE_APP_TNC:
          return await ApiService.getMobileAppTermsAndConditionsByVersion(
            version,
          );
        default:
          break;
      }
    } catch (error) {
      throw error;
    }
  }

  // 1. Get version list from server, e.g. staticDataUpdateHistoryList
  // 2. check if saved version is older than server,
  // 3. if yes, call specific api to get data and save it in locally using dataType as key
  // 4. if no, return saved data
  async getVersionData(dataType, keyDataTypeVersion) {
    console.log('DataUpdateService -> getTNC');
    try {
      if (!this.dataVersionResponse) {
        await this.getDataHistory();
      }

      if (this.dataVersionResponse) {
        let dataVersionList = this.dataVersionResponse
          .staticDataVersionHistoryList;
        let serverVersion;
        console.log(`dataVersionList.forEach, list: ${dataVersionList}`);
        dataVersionList.forEach((obj, index, array) => {
          if (obj.dataType === dataType) {
            serverVersion = obj.dataVersion;
          }
        });

        let savedVersion = await DataPersister.getString(keyDataTypeVersion);

        let needUpdate = false;
        if (!savedVersion || savedVersion !== serverVersion) {
          needUpdate = true;
        }
        console.log(
          'DataUpdateService -> getTNC',
          ' dataType:',
          dataType,
          '-> needUpdate: ',
          needUpdate,
        );
        if (needUpdate) {
          console.log('I need to update: ', dataType, serverVersion);
          let dataListResponse = await this.getDataVersionApiByTypeAndVersion(
            dataType,
            serverVersion,
          );
          if (dataListResponse) {
            await this.resetReadStatus(dataType);
            console.log('1 DataPersister.setString');
            await DataPersister.setString(keyDataTypeVersion, serverVersion);
            await DataPersister.setJson(dataType, dataListResponse);
            return dataListResponse;
          }
        } else {
          let dataList = await DataPersister.getJson(dataType);
          return dataList;
        }
      } else {
        return AppError.APP_API_ERROR;
      }
    } catch (error) {
      throw error;
    }
  }
}

export let DataUpdateService = new _DataUpdateService();
