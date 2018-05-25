namespace Aris.API.Models
{
  public class OccurenceConnection
  {
    public string kind { get; set; }
    public string occid { get; set; }
    public string type { get; set; }
    public string typename { get; set; }
    public string apiname { get; set; }
    public string source_guid { get; set; }
    public string target_guid { get; set; }
    public string source_link { get; set; }
    public string target_link { get; set; }
    public string source_occid { get; set; }
    public string target_occid { get; set; }
  }
}
