using System.ComponentModel;

namespace Aris.API.ApiConfigs
{
  public enum ApiTypeEnum
  {
    [Description("~/ApiConfigs/LocationApi.xml")]
    Locations,
    [Description("~/ApiConfigs/PersonApi.xml")]
    Persons,
    [Description("~/ApiConfigs/CreateApi.xml")]
    CreateData,
    [Description("~/ApiConfigs/DeleteApi.xml")]
    DeleteData,
    [Description("~/ApiConfigs/ModelConnectionApi.xml")]
    ModelConnection,

    BackupsByRole,

    RolesByJob,
    [Description("~/ApiConfigs/AllBackups.xml")]
    AllBackups,
    [Description("~/ApiConfigs/AllJobs.xml")]
    AllJobs,
    [Description("~/ApiConfigs/AllRoles.xml")]
    AllRoles,
    Jobs
  }
}
