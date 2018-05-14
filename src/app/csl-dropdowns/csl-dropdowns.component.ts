import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { CsvTableComponent } from '../csv-table/csv-table.component';

import { CslService } from '../../app/csl.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-csl-dropdowns',
  templateUrl: './csl-dropdowns.component.html',
  styleUrls: ['./csl-dropdowns.component.css'],
})
export class CslDropdownsComponent implements OnInit {
  @ViewChild('CsvTableComponent') csvTableComponent: CsvTableComponent;
  title = 'app';
  flag = false;
  tableContent = [];
  selectedLocation = [];
  dropdownLocationSettings = {};
  dropdownPersonSettings = {};
  dropdownJobSettings = {};
  dropdownRoleSettings = {};
  dropdownBackupSettings = {};
  dropdownHeadSettings = {};
  dropdownSupervisorsSettings = {};
  location = [];
  headData = [];
  persons = [];
  job = [];
  roles = [];
  backup = [];
  supervisors = [];
  selectedPersons = [];
  selectedHead = [];
  selectedJobs = [];
  selectedRoles = [];
  selectedBackups = [];
  selectedSupervisors = [];
  response = {
    Location: {},
    Supervisors: {},
    Head: {},
    Person: {},
    Job: [],
    Role: [],
    Backup: []
  };
  cslService: CslService;


  constructor(cslService: CslService) {
    this.cslService = cslService;
  }

  ngOnInit() {
    this.getLocationData();

    this.dropdownLocationSettings = {
      singleSelection: true,
      idField: 'Name',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      enableCheckAll: false
    };

    this.dropdownHeadSettings = {
      singleSelection: true,
      idField: 'Name',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      enableCheckAll: false
    };

    this.dropdownSupervisorsSettings = {
      singleSelection: true,
      idField: 'Name',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      enableCheckAll: false
    };


    this.dropdownPersonSettings = {
      singleSelection: true,
      idField: 'Name',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      enableCheckAll: false
    };

    this.dropdownJobSettings = {
      singleSelection: false,
      idField: 'JobName',
      textField: 'JobName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      enableCheckAll: false
    };

    this.dropdownRoleSettings = {
      singleSelection: false,
      idField: 'RoleName',
      textField: 'RoleName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: false
    };

    this.dropdownBackupSettings = {
      singleSelection: false,
      idField: 'Name',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: false
    };

  }

  getLocationData() {
    const self = this;
    self.cslService
      .getCSLData('Location').subscribe(
      obj => {
        self.location = obj['Locations'];
        self.supervisors = obj['Supervisors'];
        self.headData = obj['TeamLeads'];
      }, err => {
        console.log(err);
      });
  }


  addRow() {
    const self = this;
    this.flag = true;
    self.response.Role = _.uniq(self.response.Role);
    const roleNames = [];
    const tableData = {};
    tableData['location'] = self.response.Location['Name'];
    tableData['supervisors'] = self.response.Supervisors['Name'];
    tableData['head'] = self.response.Head['Name'];

    tableData['jobName'] = (self.response.Job.length > 0) ?
      self.response.Job.map(x => x.JobName).join(', ') : 'NA';

    tableData['roleName'] = (self.response.Role.length > 0) ?
      self.response.Role.map(x => x.RoleName).join(', ') : 'NA';

    tableData['backup'] = (self.response.Backup.length > 0) ?
      self.response.Backup.map(x => x.Name).join(', ') : 'NA';

    tableData['name'] = self.response.Person['Name'];
    // if (self.response.Person.length > 0) {
    //   _.forEach(self.response.Person, function (obj) {
    //     const o = _.cloneDeep(tableData);
    //     o['name'] = obj.Name;
    //     self.tableContent.push(o);
    //   });
    // }
    this.clearData();
    self.tableContent.push(tableData);
    this.csvTableComponent.addRow();
  }

  clearData() {
    const self = this;
    self.response.Person = {};
    self.response.Job = [];
    self.response.Role = [];
    self.response.Backup = [];
    // self.persons = [];
    // self.selectedHead = [];
    // self.selectedLocation = [];
    // self.selectedPersons = [];
    // self.selectedSupervisors = [];
    self.roles = [];
    self.backup = [];
    self.job = [];
    self.selectedPersons = [];
    self.selectedJobs = [];
    self.selectedRoles = [];
    self.selectedBackups = [];
  }

  onFilterChange($event, category) {
    const self = this;
    if (category === 'person') {
      if ($event === '') {
        self.persons = [];
        return;
      }

      const requestObj = {
        'supervisorName': self.response.Supervisors['Name'],
        'LocationName': self.response.Location['Name'],
        'PersonName': $event,
        'token': localStorage.getItem('token')
      };

      self.cslService.getCSLData('Persons', requestObj)
        .subscribe(obj => {
          self.persons = obj;
        });
    } else if (category === 'Job') {
      if ($event === '') {
        self.job = [];
        return;
      }

      const requestObj = {
        'JobName': $event,
        'token': localStorage.getItem('token')
      };

      self.cslService.getCSLData('GetAllJobs', requestObj)
      .subscribe(obj => {
        self.job = obj;
      });

    } else if (category === 'Role') {
      if ($event === '') {
        self.roles = [];
        return;
      }

      const requestObj = {
        'RoleName': $event,
        'token': localStorage.getItem('token')
      };

      self.cslService.getCSLData('GetAllRoles', requestObj)
      .subscribe(obj => {
        self.roles = obj;
      });
    } else if (category === 'Backup') {
      if ($event === '') {
        self.roles = [];
        return;
      }

      const requestObj = {
        'BackupName': $event,
        'token': localStorage.getItem('token')
      };

      self.cslService.getCSLData('GetAllBackups', requestObj)
      .subscribe(obj => {
        self.backup = obj;
      });
    }

  }

  // getJobData() {
  //   const self = this;
  //   const requestObj = {
  //     'token': localStorage.getItem('token')
  //   };

  //   self.cslService.getCSLData('GetAllJobs', requestObj)
  //     .subscribe(obj => {
  //       self.job = obj[0]['Jobs'];
  //     });
  // }


  onCheckboxSelect(item, category) {

    const self = this;
    let temp = [];
    switch (category) {
      case 'Location':
        self.onDeselct({}, 'Supervisors');
        temp = _.find(self.location, x => x['Name'] === item);
        self.response.Location = temp;
        break;

      case 'Supervisors':
        self.onDeselct({}, 'Head');
        temp = _.find(self.supervisors, x => x['Name'] === item);
        self.response.Supervisors = temp;

        const teamLeadName = {
          'supervisorName': self.response.Supervisors['Name'],
          'LocationName': self.response.Location['Name'],
          'token': localStorage.getItem('token')
        };
        this.cslService.getCSLData('Persons', teamLeadName)
          .subscribe(obj => {
            self.persons = obj;
            // self.selectedPersons = obj;
            // self.response.Person = obj;
          });
        break;

      case 'Head':
        self.onDeselct({}, 'Person');
        temp = _.find(self.headData, x => x['Name'] === item);
        self.response.Head = temp;
        break;

      case 'Person':
        self.onDeselct({}, 'Job');
        self.onDeselct({}, 'Role');
        temp = _.find(self.persons, x => x['Name'] === item);
        self.response.Person = temp;

        const requestObj = {
          'supervisorName': self.response.Supervisors['Name'],
          'LocationName': self.response.Location['Name'],
          'PersonName': self.response.Person['Name'],
          'token': localStorage.getItem('token')
        };

        self.cslService.getCSLData('Jobs', requestObj)
          .subscribe(obj => {
            if (obj.length > 0) {
            if (obj[0].hasOwnProperty('Jobs')) {
            self.job = obj[0]['Jobs'];
            self.response.Job = obj[0]['Jobs'];
            self.selectedJobs = obj[0]['Jobs'];
            }
            if (obj[0].hasOwnProperty('Roles')) {
            self.response.Role = obj[0]['Roles'];
            self.roles = obj[0]['Roles'];
            self.selectedRoles = obj[0]['Roles'];
            }
          }
          });
        break;

      case 'Job':
        temp = _.find(self.job, x => x['JobName'] === item);
        self.response.Job.push(temp);

        const request = {
          'JobName': item,
          'token': localStorage.getItem('token')
        };

        self.cslService.getCSLData('GetRolesByJob', request)
          .subscribe(obj => {
            self.roles = obj['JobRoles'];
            self.response.Role = obj['JobRoles'];
            self.selectedRoles = obj['JobRoles'];
          });
        break;

      case 'Role':
        temp = _.find(self.roles, x =>  x.RoleName === item);
        self.response.Role.push(temp);


        const requestObject = {
          'RoleName': item,
          'token': localStorage.getItem('token')
        };

        self.cslService.getCSLData('GetBackupsByRole', requestObject)
          .subscribe(obj => {
            console.log(obj);
            self.backup = obj['Backups'];
            self.response.Backup = obj['Backups'];
            self.selectedBackups = obj['Backups'];
          });
        // self.selectedBackups = _.filter(self.backup, function (obj) {
        //   if (_.includes(selectedObj.backupsIds, obj.id)) {
        //     self.response.Backup.push(obj);
        //     return obj;
        //   }
        // });
        break;

      case 'Backup':
      temp = _.find(self.backup, x =>  x.Name === item);
        self.response.Backup.push(temp);
        break;
    }
  }


  onDeselct(item: any, category: any) {
    const self = this;
    let temp;
    if (category === 'Location') {
      self.clearData();
    } else if (category === 'Supervisors') {
      self.response.Head = {};
      self.response.Supervisors = {};
      self.response.Person = {};
      self.response.Job = [];
      self.response.Role = [];
      self.response.Backup = [];
      self.selectedSupervisors = [];
      self.selectedJobs = [];
      self.selectedRoles = [];
      self.selectedBackups = [];
      self.selectedHead = [];
    } else if (category === 'Head') {
      self.response.Head = {};
      self.response.Person = {};
      self.response.Job = [];
      self.response.Role = [];
      self.response.Backup = [];
      self.selectedJobs = [];
      self.selectedRoles = [];
      self.selectedBackups = [];
      self.selectedHead = [];
      self.selectedPersons = [];
    } else if (category === 'Person') {
      self.response.Person = {};
      self.response.Job = [];
      self.response.Role = [];
      self.response.Backup = [];
      self.selectedJobs = [];
      self.selectedRoles = [];
      self.selectedBackups = [];
    } else if (category === 'Job') {
      if (_.isEmpty(item)) {
        self.response.Job = [];
      } else {
        temp = _.find(self.job, x => x['JobName'] === item);
        _.pull(self.response.Job, temp);
      }
    } else if (category === 'Role') {
      if (_.isEmpty(item)) {
        self.response.Role = [];
      } else {
        temp = _.find(self.roles, x =>  x.RoleName === item);
        _.pull(self.response.Role, temp);
      }
    } else if (category === 'Backup') {
      if (_.isEmpty(item)) {
        self.response.Backup = [];
      } else {
        temp = _.find(self.backup, x =>  x.Name === item);
        _.pull(self.response.Backup, temp);
      }
    }
  }


} // end of component
