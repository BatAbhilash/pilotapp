using System.Collections.Generic;

namespace Aris.API.Models
{
    public class Person
    {
        public string PersonId { get; set; }
        //public string LocationId { get; set; }
        //public string SupervisorId { get; set; }
        //public string TeamLeadId { get; set; }
        public string LocationName { get; set; }
        public string SupervisorName { get; set; }
        public string TeamLeadName { get; set; }
        public string Name { get; set; }

        public bool HasMapping { get; set; }

        public string Color { get; set; }

        public List<Job> Jobs { get; set; }
        public List<Role> Roles { get; set; }

        public string Status { get; set; } = "No Change";
    }
}