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
    Person: [],
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
      singleSelection: false,
      idField: 'PersonId',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      enableCheckAll: false
    };

    this.job = [
      { JobId: 1, JobName: 'Warehousing and Inventory Control', PersonId: 2, RoleId: [4, 1] },
      { JobId: 2, JobName: 'Materials planning and scheduling', PersonId: 3, RoleId: [4, 3] },
      { JobId: 3, JobName: 'Project Management Clinical', PersonId: 4, RoleId: [1, 2] },
      { JobId: 5, JobName: 'Purchasing', PersonId: 7, RoleId: [4] },
      { JobId: 6, JobName: 'Operations Support', PersonId: 10, RoleId: [3] },
      { JobId: 7, JobName: 'Clinical Development/Operations (non-MD)', PersonId: 1, RoleId: [1] },
      { JobId: 8, JobName: 'Tax', PersonId: 1, RoleId: [2] },
    ];

    this.dropdownJobSettings = {
      singleSelection: false,
      idField: 'JobId',
      textField: 'JobName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      enableCheckAll: false
    };

    this.roles = [
      { RoleId: 1, RoleName: 'AHP/HTC/NBA', backupsIds: [2] },
      { RoleId: 2, RoleName: 'Catalog Administrator', backupsIds: [1] },
      { RoleId: 3, RoleName: 'Business Technology Representative', backupsIds: [3] },
      { RoleId: 4, RoleName: 'Sr. Manager/Manager', backupsIds: [4] },
    ];

    this.dropdownRoleSettings = {
      singleSelection: false,
      idField: 'RoleId',
      textField: 'RoleName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: false
    };

    this.backup = [
      { id: 1, Email: 'milind.kolte@kanakasoftware.com', FirstName: 'Anita Jivani', LastName: 'Kolte' },
      { id: 2, Email: 'praneet.nadkar@kanakasoftware.com', FirstName: 'Dax Howard', LastName: 'Nadkar' },
      { id: 3, Email: 'praneet.nadkar@kanakasoftware.com', FirstName: 'Vivek Maiya', LastName: 'Nadkar' },
      { id: 4, Email: 'praneet.nadkar@kanakasoftware.com', FirstName: 'Jennifer Koger', LastName: 'Nadkar' }
    ];

    this.dropdownBackupSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'FirstName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: false
    };

  }

  onHeadSelect(item: any) {
    const self = this;
    self.response.Head = item;
    const teamLeadName = {
      'teamLeadName': item['Name'],
      'personName': '',
      'token': localStorage.getItem('token')
    };

    this.cslService.getCSLData('Persons', teamLeadName)
      .subscribe(obj => {
        self.persons = obj;
        self.selectedPersons = obj;
        self.response.Person = obj;
      });

    this.persons = [];
  }

  onDeselct(item: any, category: any) {
    const self = this;
    if (category === 'Location') {
      self.clearData();
    } else if (category === 'Supervisors') {
      self.response.Head = {};
      self.response.Supervisors = {};
      self.response.Person = [];
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
      self.response.Person = [];
      self.response.Job = [];
      self.response.Role = [];
      self.response.Backup = [];
      self.selectedJobs = [];
      self.selectedRoles = [];
      self.selectedBackups = [];
      self.selectedHead = [];
    } else if (category === 'Person') {
      // self.response.Person = {};
      _.pullAll(self.response.Person, item);
      console.log(self.response.Person);
      self.response.Job = [];
      self.response.Role = [];
      self.response.Backup = [];
      self.selectedJobs = [];
      self.selectedRoles = [];
      self.selectedBackups = [];
    } else if (category === 'Job') {
      _.pullAll(self.response.Job, item);
    } else if (category === 'Role') {
      _.pullAll(self.response.Role, item);
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
  }

  getLocationData() {
    this.cslService
      .getCSLData('Location').subscribe(
      obj => {
        this.location = obj;
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
      self.response.Backup.map(x => x.FirstName).join(', ') : 'NA';

    if (self.response.Person.length > 0) {
      _.forEach(self.response.Person, function (obj) {
        const o = _.cloneDeep(tableData);
        o['name'] = obj.Name;
        self.tableContent.push(o);
      });
    }
    this.clearData();
    this.csvTableComponent.addRow();
  }

  clearData() {
    const self = this;
    self.response = {
      Location: {},
      Head: {},
      Supervisors: {},
      Person: [],
      Job: [],
      Role: [],
      Backup: []
    };
    self.selectedHead = [];
    self.selectedLocation = [];
    self.selectedPersons = [];
    self.selectedJobs = [];
    self.selectedRoles = [];
    self.selectedBackups = [];
    self.selectedSupervisors = [];
  }

  onFilterChange($event, category) {
    const self = this;

    if (category === 'person') {
      // this.persons = this.selectedPersons;
      if ($event === '' || !this.response.Head['Name']) {
        this.persons = [];
        return;
      }

      const teamLeadName = {
        'LocationName': self.response.Location['Name'],
        'SupervisorName': self.response.Supervisors['Name'],
        'TeamLeadName': self.response.Head['Name'],
        'personName': $event,
        'token': localStorage.getItem('token')
      };

      this.cslService.getCSLData('Persons', teamLeadName)
        .subscribe(obj => {
          console.log(obj);
          self.persons = obj;
        });
    }
    self.persons = _.uniq(self.persons);
    console.log(self.persons);
  }

  onCheckboxSelect(item, category) {
    console.log(item);
    const self = this;
    let temp = [];
    switch (category) {
      case 'Location':
        self.onDeselct({}, 'Supervisors');
        temp = _.filter(self.location, x => x['Name'] === item);
        self.response.Location = temp[0];
        self.supervisors = temp[0]['Supervisors'];
        break;

      case 'Supervisors':
      self.onDeselct({}, 'Head');
      temp = _.filter(self.supervisors, x => x['Name'] === item);
      self.response.Supervisors = temp[0];
      self.headData = temp[0].TeamLeads;
        break;

      case 'Head':
        self.onDeselct({}, 'Person');
        temp = _.filter(self.headData, x => x['Name'] === item);
        self.response.Head = temp[0];
        self.persons = temp[0]['Persons'];
        self.selectedPersons = temp[0]['Persons'];
        self.response.Person = temp[0]['Persons'];
        break;

      case 'Person':
        self.onDeselct({}, 'Job');
        self.onDeselct({}, 'Role');
          self.response.Person.push(item);
        break;

      case 'Job':
        self.response.Job.push(item);
        break;

      case 'Role':
        self.selectedJobs = [];
        self.response.Job = [];
        self.response.Role.push(item);
        const selectedObj = _.find(self.roles, function (obj) {
          return obj.RoleId === item.RoleId;
        });
        self.selectedBackups = _.filter(self.backup, function (obj) {
          if (_.includes(selectedObj.backupsIds, obj.id)) {
            self.response.Backup.push(obj);
            return obj;
          }
        });
        break;

      case 'Backup':
        self.response.Backup.push(item);
        break;
    }
  }
}
