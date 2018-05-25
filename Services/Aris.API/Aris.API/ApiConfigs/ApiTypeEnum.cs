using System.ComponentModel;

namespace Aris.API.ApiConfigs
{
  public enum ApiTypeEnum
  {
    [Description("~/ApiConfigs/PersonApi.xml")]
    Locations,
    [Description("~/ApiConfigs/PersonApi.xml")]
    Persons,
    [Description("~/ApiConfigs/CreateApi.xml")]
    CreateData,
    [Description("~/ApiConfigs/DeleteApi.xml")]
    DeleteData,
    [Description("~/ApiConfigs/ModelConnectionApi.xml")]
    ModelConnection,
  }
}
