using System.Collections.Generic;

namespace Aris.API.Models.Connections
{
  public class Mapping
  {
    public string Location { get; set; }
    public string LocationId { get; set; }
    public string Supervisor { get; set; }
    public string SupervisorId { get; set; }
    public string Person { get; set; }
    public string PersonId { get; set; }
    public List<MappingJob> Jobs { get; set; }
    public List<MappingRole> Roles { get; set; }
    public string Status { get; set; }
  }

  public class MappingJob
  {
    public string JobName { get; set; }
    public string JobId { get; set; }
  }

  public class MappingRole
  {
    public string RoleName { get; set; }
    public string RoleId { get; set; }
    public string Backup { get; set; }
    public string BackupId { get; set; }
  }

}
