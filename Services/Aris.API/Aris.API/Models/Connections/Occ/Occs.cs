using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Aris.API.Models.Connections.Occ
{
  public class Occs
  {
  }

  public class Link
  {
    public string kind { get; set; }
    public string method { get; set; }
    public string href { get; set; }
    public string rel { get; set; }
  }

  public class Attribute
  {
    public string kind { get; set; }
    public string id { get; set; }
    public string typename { get; set; }
    public int type { get; set; }
    public string apiname { get; set; }
    public string language { get; set; }
    public string value { get; set; }
  }

  public class Link2
  {
    public string kind { get; set; }
    public string method { get; set; }
    public string href { get; set; }
    public string rel { get; set; }
  }

  public class Attribute2
  {
    public string kind { get; set; }
    public string id { get; set; }
    public string typename { get; set; }
    public int type { get; set; }
    public string apiname { get; set; }
    public string language { get; set; }
    public string value { get; set; }
  }

  public class Modelobject
  {
    public string kind { get; set; }
    public string occid { get; set; }
    public string guid { get; set; }
    public Link2 link { get; set; }
    public int type { get; set; }
    public string typename { get; set; }
    public string apiname { get; set; }
    public int symbol { get; set; }
    public string symbolname { get; set; }
    public string symbol_apiname { get; set; }
    public List<Attribute2> attributes { get; set; }
    public string symbol_guid { get; set; }
  }

  public class SourceLink
  {
    public string kind { get; set; }
    public string method { get; set; }
    public string href { get; set; }
    public string rel { get; set; }
  }

  public class TargetLink
  {
    public string kind { get; set; }
    public string method { get; set; }
    public string href { get; set; }
    public string rel { get; set; }
  }

  public class Modelconnection
  {
    public string kind { get; set; }
    public string occid { get; set; }
    public int type { get; set; }
    public string typename { get; set; }
    public string apiname { get; set; }
    public string source_guid { get; set; }
    public string target_guid { get; set; }
    public SourceLink source_link { get; set; }
    public TargetLink target_link { get; set; }
    public string source_occid { get; set; }
    public string target_occid { get; set; }
  }

  public class Item
  {
    public string kind { get; set; }
    public string guid { get; set; }
    public Link link { get; set; }
    public int type { get; set; }
    public string typename { get; set; }
    public string apiname { get; set; }
    public List<Attribute> attributes { get; set; }
    public List<Modelobject> modelobjects { get; set; }
    public List<Modelconnection> modelconnections { get; set; }
  }

  public class OccsRootObject
  {
    public string kind { get; set; }
    public string request { get; set; }
    public string status { get; set; }
    public int item_count { get; set; }
    public List<Item> items { get; set; }
  }
}
