using System.Collections.Generic;

namespace Aris.API.Models.Connections
{
  public class Attribute
  {
    public string kind { get; set; }
    public int type { get; set; }
    public string value { get; set; }
  }

  public class Modelobject
  {
    public string kind { get; set; }
    public string occid { get; set; }
    public string guid { get; set; }
    public int type { get; set; }
    public string symbol { get; set; }
    public List<Attribute> attributes { get; set; }
  }

  public class Modelconnection
  {
    public string kind { get; set; }
    public int type { get; set; }
    public string source_occid { get; set; }
    public string target_occid { get; set; }
  }

  public class CreateConnection
  {
    public List<Modelobject> modelobjects { get; set; }
    public List<Modelconnection> modelconnections { get; set; }
  }
}
