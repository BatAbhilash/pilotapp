using System.Collections.Generic;

namespace Aris.API.Models
{
    public class Job
    {
        public string PersonId { get; set; }
        public string PersonName { get; set; }
        public string JobId { get; set; }
        public string JobName { get; set; }
        public string Color { get; set; }
        public string Status { get; set; } = "No Change";
        public List<Role> JobRoles { get; set; }
    }
}