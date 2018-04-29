import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as _ from 'lodash';

// import '../assets/bootstrap-multiselect.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  flag = false;
  tableContent = [];
  dropdownList = [];
  selectedLocation = [];
  dropdownLocationSettings = {};
  dropdownPersonSettings = {};
  dropdownJobSettings = {};
  dropdownRoleSettings = {};
  dropdownBackupSettings = {};
  location = [];
  persons = [];
  job = [];
  roles = [];
  backup = [];
  personsByLocation = [];
  selectedPersons = [];
  selectedJobs = [];
  selectedRoles = [];
  selectedBackups = [];
  response = {
    Location: {},
    Person: {},
    Job: {},
    Role: [],
    Backup: []
  };

  constructor() {

  }

  ngOnInit() {
    this.location = [
      { LocationId: 1, LocationName: 'Sydney' },
      { LocationId: 2, LocationName: 'New York' },
      { LocationId: 3, LocationName: 'Seattle' },
      { LocationId: 4, LocationName: 'Dallas' }
    ];
    this.dropdownLocationSettings = {
      singleSelection: true,
      idField: 'LocationId',
      textField: 'LocationName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      enableCheckAll : false
    };

    this.persons = [
      { LocationId: 1, LocationName: 'Sydney', Id: 1, FirstName: 'Matt', LastName: 'Demon' },
      { LocationId: 2, LocationName: 'New York', Id: 2, FirstName: 'Jimmy', LastName: 'Kimbell', HasJobsAssociated: true },
      { LocationId: 2, LocationName: 'New York', Id: 3, FirstName: 'Matt1', LastName: 'Shaw', HasJobsAssociated: true },
      { LocationId: 3, LocationName: 'Seattle', Id: 4, FirstName: 'Richard', LastName: 'Benoff', HasJobsAssociated: true },
      { LocationId: 3, LocationName: 'Seattle', Id: 23, FirstName: 'Tom', LastName: 'Hanks' },
      { LocationId: 3, LocationName: 'Seattle', Id: 79, FirstName: 'Arnold', LastName: 'Demon' },
      { LocationId: 4, LocationName: 'Dallas', Id: 31, FirstName: 'Mathew', LastName: 'Zest', HasJobsAssociated: true },
      { LocationId: 4, LocationName: 'Dallas', Id: 78, FirstName: 'Zee', LastName: 'Dawn' },
      { LocationId: 4, LocationName: 'Dallas', Id: 98, FirstName: 'Tim', LastName: 'Crew' },
      { LocationId: 4, LocationName: 'Dallas', Id: 49, FirstName: 'John', LastName: 'Danny', HasJobsAssociated: true },
    ];
    this.dropdownPersonSettings = {
      singleSelection: true,
      idField: 'Id',
      textField: 'FirstName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      enableCheckAll : false
    };

    this.job = [
      { JobId: 1, JobName: 'job 1', PersonId: 1, RoleIds: [1] },
      { JobId: 2, JobName: 'job 2', PersonId: 3, RoleIds: [1, 2] },
      { JobId: 3, JobName: 'job 3', PersonId: 4, RoleIds: [3] },
    ];

    this.dropdownJobSettings = {
      singleSelection: true,
      idField: 'JobId',
      textField: 'JobName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      enableCheckAll : false
    };

    this.roles = [
      { RoleId: 1, RoleName: 'Role1 for job 1', backupsIds: [2] },
      { RoleId: 2, RoleName: 'Role1 for job 2', backupsIds: [1, 2] },
      { RoleId: 3, RoleName: 'Role2 for job 2', backupsIds: [2] },
      { RoleId: 4, RoleName: 'Role1 for job 3', backupsIds: [1] },
    ];

    this.dropdownRoleSettings = {
      singleSelection: false,
      idField: 'RoleId',
      textField: 'RoleName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll : false
    };

    this.backup = [
      { id: 1, Email: 'milind.kolte@kanakasoftware.com', FirstName: 'Milind', LastName: 'Kolte' },
      { id: 2, Email: 'praneet.nadkar@kanakasoftware.com', FirstName: 'Praneet', LastName: 'Nadkar' },
    ];

    this.dropdownBackupSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'FirstName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll : false
    };
  }

  onLocationSelect(item: any) {
    const self = this;
    self.response.Location = item;
    this.personsByLocation = _.filter(self.persons, function (obj) {
      if (obj.LocationId === item.LocationId) {
        return obj;
      }
    });
  }

  onPersonSelect(item: any) {
    const self = this;
    self.response.Person = item;
    this.selectedJobs = _.filter(self.job, function (obj) {
      if (obj.PersonId === item.Id) {
        return obj;
      }
    });
    if (this.selectedJobs.length > 0) {
      this.onJobSelect(this.selectedJobs[0]);
    }
    console.log(this.selectedJobs);
  }

  onJobSelect(item: any) {
    const self = this;
    self.response.Job = item;
    const selectedObj = _.find(self.job, function (obj) {
      return obj.JobId === item.JobId;
    });
    this.selectedRoles = _.filter(self.roles, function (obj) {
      if (_.includes(selectedObj.RoleIds, obj.RoleId)) {
        self.response.Role.push(obj.RoleId);
        return obj;
      }
    });
    if (this.selectedRoles.length > 0) {
      this.onRoleSelect(this.selectedRoles[0]);
    }
    console.log(this.selectedRoles);
  }

  onRoleSelect(item: any) {
    const self = this;
    self.response.Role.push(item.RoleId);
    const selectedObj = _.find(self.roles, function (obj) {
      return obj.RoleId === item.RoleId;
    });
    this.selectedBackups = _.filter(self.backup, function (obj) {
      if (_.includes(selectedObj.backupsIds, obj.id)) {
        self.response.Backup.push(obj.id);
        return obj;
      }
    });
    console.log(this.selectedRoles);
  }

  onDeselct(item: any, category: any) {
    const self = this;
    if (category === 'Location') {
      self.response = {
        Location: {},
        Person: {},
        Job: {},
        Role: [],
        Backup: []
      };
      this.selectedLocation = [];
      self.selectedPersons = [];
      self.selectedJobs = [];
      self.selectedRoles = [];
      self.selectedBackups = [];
    } else if (category === 'Person') {
      self.response.Person = {};
      self.response.Job = {};
      self.response.Role = [];
      self.response.Backup = [];
      self.selectedJobs = [];
      self.selectedRoles = [];
      self.selectedBackups = [];
    } else if (category === 'Job') {
      self.response.Job = {};
      self.response.Role = [];
      self.response.Backup = [];
      self.selectedRoles = [];
      self.selectedBackups = [];
    } else if (category === 'Role') {

      if (self.response.Role.length > 0) {
        self.response.Role = _.filter(self.response.Role, function (obj) {
          return obj.RoleId !== item.RoleId;
        });
      } else {
        self.response.Role = [];
        self.response.Backup = [];
      }
      self.selectedBackups = [];
    } else {
      if (self.response.Backup.length > 0) {
        self.selectedRoles = _.filter(self.selectedRoles, function (obj) {
          return obj.id !== item.id;
        });
      } else {
        self.response.Backup = [];
      }
    }

    console.log(item);
    console.log(category);
  }
  onBackupSelect(item: any) {
    this.response.Backup.push(item.id);
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  open(content) {
    const self = this;
    this.flag = true;

    self.response.Role = _.uniq(self.response.Role);
    const roleNames = [];
    _.each(self.roles, function(o) {
      if (_.includes(self.response.Role, o.RoleId)) {
        roleNames.push(o.RoleName);
      }
    });

    self.response.Backup = _.uniq(self.response.Backup);
    const backupNames = [];
     _.each(self.backup, function(o) {
      if (_.includes(self.response.Backup, o.id)) {
        backupNames.push(o.Email);
      }
    });
    console.log(backupNames);
    this.tableContent[0] = {
      Location: self.response.Location['LocationName'],
      Person: self.response.Person['FirstName'],
      Job: self.response.Job['JobName'],
      Role: roleNames.join(', '),
      Backup: backupNames.join(', '),
    };
    console.log(content.value);
  }

}
