﻿using System.Collections.Generic;

namespace Aris.API.Models
{
    public class Role
    {
        public string PersonId { get; set; }
        public string PersonName { get; set; }
        public string JobId { get; set; }
        public string RoleId { get; set; }
        public string RoleName { get; set; }
        public string Color { get; set; }
        public string Status { get; set; } = "No Change";
        public List<Person> Backups { get; set; }
    }
}