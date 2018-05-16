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
  loading = false;
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
  originalMapping: any;
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
      enableCheckAll: false,
      color: 'Color'
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
      enableCheckAll: false,
      color: 'Color'
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
      enableCheckAll: false,
      color: 'Color'
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
      enableCheckAll: false,
      color: 'Color'
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
      enableCheckAll: false,
      color: 'Color'
    };

    this.dropdownRoleSettings = {
      singleSelection: false,
      idField: 'RoleName',
      textField: 'RoleName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: false,
      color: 'Color'
    };

    this.dropdownBackupSettings = {
      singleSelection: false,
      idField: 'Name',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: false,
      color: 'Color'
    };

  }

  getLocationData() {
    const self = this;
    self.loading = true;
    self.cslService
      .getCSLData('Location').subscribe(
      obj => {
        self.location = obj['Locations'];
        self.supervisors = obj['Supervisors'];
        self.headData = obj['TeamLeads'];
        self.loading = false;
      }, err => {
        console.log(err);
        self.loading = false;
      });
  }


  addRow() {
    const self = this;
    // if (self.originalMapping['LocationName'] === self.response.Location['Name']
    //   && self.originalMapping['SupervisorName'] === self.response.Supervisors['Name']
    //   && self.originalMapping['TeamLeadName'] === self.response.Head['Name']
    //   && self.originalMapping['Name'] === self.response.Person['Name']
    //   && _.isEqual(self.originalMapping['Jobs'], self.response.Job)
    //   && _.isEqual(self.originalMapping['Roles'], self.response.Role)
    // ) {
    //   console.log('Mapping needs to be changed...!');
    //   return;
    // }

    this.flag = true;
    self.response.Role = _.uniq(self.response.Role);
    const roleNames = [];
    const tableData = {};
    tableData['location'] = self.response.Location['Name'];
    tableData['supervisors'] = self.response.Supervisors['Name'];
    tableData['head'] = self.response.Head['Name'];
    tableData['name'] = self.response.Person['Name'];

    // tableData['jobName'] = (self.response.Job.length > 0) ?
    //   self.response.Job.map(x => x.JobName).join(', ') : 'NA';

    tableData['roleName'] = (self.response.Role.length > 0) ?
      self.response.Role.map(x => x.RoleName).join(', ') : 'NA';

    tableData['backup'] = (self.response.Backup.length > 0) ?
      self.response.Backup.map(x => x.Name).join(', ') : 'NA';

    if (self.response.Job.length > 0) {
      _.forEach(self.response.Job, function (obj) {
        const o = _.cloneDeep(tableData);
        o['jobName'] = obj.JobName;
        self.tableContent.push(o);
      });
    } else {
      tableData['jobName'] = 'NA';
      self.tableContent.push(tableData);
    }
    this.clearData();
    this.csvTableComponent.addRow();
  }

  clearData() {
    const self = this;
    self.response.Person = {};
    self.response.Job = [];
    self.response.Role = [];
    self.response.Backup = [];
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
    let requestObj: any = {};

    switch (category) {
      case 'person':
        if ($event === '') {
          self.persons = [];
          return;
        }
        self.loading = true;
        requestObj = {
          'supervisorName': self.response.Supervisors['Name'],
          'LocationName': self.response.Location['Name'],
          'PersonName': $event,
          'token': localStorage.getItem('token')
        };

        self.cslService.getCSLData('Persons', requestObj)
          .subscribe(obj => {
            self.persons = obj;
            self.loading = false;
          }, err => {
            self.loading = false;
          });
        break;
      case 'Job':
        if ($event === '') {
          self.job = [];
          return;
        }
        self.loading = true;
        requestObj = {
          'JobName': $event,
          'token': localStorage.getItem('token')
        };

        self.cslService.getCSLData('GetAllJobs', requestObj)
          .subscribe(obj => {
            self.job = obj;
            self.loading = false;
          }, err => {
            self.loading = false;
          });
        break;
      case 'Role':
        if ($event === '') {
          self.roles = [];
          return;
        }
        self.loading = true;
        requestObj = {
          'RoleName': $event,
          'token': localStorage.getItem('token')
        };

        self.cslService.getCSLData('GetAllRoles', requestObj)
          .subscribe(obj => {
            self.roles = obj;
            self.loading = false;
          }, err => {
            self.loading = false;
          });
        break;
      case 'Backup':
        if ($event === '') {
          self.roles = [];
          return;
        }
        self.loading = true;
        requestObj = {
          'BackupName': $event,
          'token': localStorage.getItem('token')
        };

        self.cslService.getCSLData('GetAllBackups', requestObj)
          .subscribe(obj => {
            self.loading = false;
            self.backup = obj;
          }, err => {
            console.log(err);
            self.loading = false;
          });
        break;
    }
    // self.loading = false;
  }

  getPersonData() {
    const self = this;
    self.loading = true;
    const requestObj = {
      'supervisorName': self.response.Supervisors['Name'],
      'LocationName': self.response.Location['Name'],
      'token': localStorage.getItem('token')
    };
    self.cslService.getCSLData('Persons', requestObj)
      .subscribe(obj => {
        self.persons = obj;
        self.loading = false;
      }, err => {
        console.log(err);
        self.loading = false;
      });
  }

  getJobData() {
    const self = this;
    self.loading = true;
    const requestObj = {
      'supervisorName': self.response.Supervisors['Name'],
      'LocationName': self.response.Location['Name'],
      'PersonName': self.response.Person['Name'],
      'token': localStorage.getItem('token')
    };

    self.cslService.getCSLData('Jobs', requestObj)
      .subscribe(obj => {
        if (obj.length > 0) {
          self.originalMapping = obj;
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
          console.log(obj);
        }
        self.loading = false;
      }, err => {
        self.loading = false;
      });
  }

  GetRolesByJob() {
    const self = this;
    self.loading = true;
    const item = _.last(self.response.Job);
    const request = {
      'JobName': item['JobName'],
      'Color': item['Color'],
      'token': localStorage.getItem('token')
    };

    self.cslService.getCSLData('GetRolesByJob', request)
      .subscribe(obj => {
        console.log(obj);
        self.roles = obj['JobRoles'];
        self.response.Role = obj['JobRoles'];
        self.selectedRoles = obj['JobRoles'];
        self.loading = false;
      }, err => {
        self.loading = false;
      });
  }

  getBackupByRoles() {
    const self = this;
    self.loading = true;
    const item = _.last(self.response.Role);
    const requestObject = {
      'RoleName': item['RoleName'],
      'token': localStorage.getItem('token')
    };

    self.cslService.getCSLData('GetBackupsByRole', requestObject)
      .subscribe(obj => {
        console.log(obj);
        self.loading = false;
        self.backup = obj['Backups'];
        self.response.Backup = obj['Backups'];
        self.selectedBackups = obj['Backups'];
      });
  }

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
        // self.getPersonData();
        break;

      case 'Head':
        self.onDeselct({}, 'Person');
        temp = _.find(self.headData, x => x['Name'] === item);
        self.response.Head = temp;
        self.getPersonData();
        break;

      case 'Person':
        self.onDeselct({}, 'Job');
        self.onDeselct({}, 'Role');
        temp = _.find(self.persons, x => x['Name'] === item);
        self.response.Person = temp;
        self.getJobData();
        break;

      case 'Job':
        temp = _.find(self.job, x => x['JobName'] === item);
        self.response.Job.push(temp);
        self.GetRolesByJob();
        break;

      case 'Role':
        temp = _.find(self.roles, x => x.RoleName === item);
        self.response.Role.push(temp);
        self.getBackupByRoles();
        break;

      case 'Backup':
        temp = _.find(self.backup, x => x.Name === item);
        self.response.Backup.push(temp);
        break;
    }
  }


  onDeselct(item: any, category: any) {
    const self = this;
    let temp;
    if (category === 'Location') {
      self.persons = [];
      self.selectedHead = [];
      self.selectedLocation = [];
      self.selectedPersons = [];
      self.selectedSupervisors = [];
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
      self.selectedPersons = [];
      self.persons = [];
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
      self.persons = [];
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
        temp = _.find(self.roles, x => x.RoleName === item);
        _.pull(self.response.Role, temp);
      }
    } else if (category === 'Backup') {
      if (_.isEmpty(item)) {
        self.response.Backup = [];
      } else {
        temp = _.find(self.backup, x => x.Name === item);
        _.pull(self.response.Backup, temp);
      }
    }
  }


} // end of component
