import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToasterModule, ToasterService } from 'angular5-toaster';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import * as _ from 'lodash';
import { CslService } from '../app/csl.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
// import '../assets/bootstrap-multiselect.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  modalRef: BsModalRef;
  source: LocalDataSource;
  today = Date.now();
  selectedRows = [];
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
  dropdownHeadSettings = {};
  location = [];
  headData = [];
  persons = [];
  job = [];
  roles = [];
  backup = [];
  personsByLocation = [];
  selectedPersons = [];
  selectedHead = [];
  selectedJobs = [];
  selectedRoles = [];
  selectedBackups = [];
  response = {
    Location: {},
    Head: {},
    Person: {},
    Job: [],
    Role: [],
    Backup: []
  };
  closeResult: string;
  modalData: {};
  settings = {
    selectMode: 'multi',
    actions: {
      delete: false,
      add: false,
      edit: false,
      select: true,
    },
    columns: {
      location: {
        title: 'Location'
      },
      name: {
        title: 'Person'
      },
      jobName: {
        title: 'Job'
      },
      roleName: {
        title: 'Role'
      },
      backup: {
        title: 'Backup'
      }
    },
    defaultStyle: false,
    attr: {
      class: 'table table-bordered'
    }
  };
  private toasterService: ToasterService;
  constructor(toasterService: ToasterService, cslService: CslService, private modalService: BsModalService) {
    this.toasterService = toasterService;
    this.source = new LocalDataSource(this.tableContent);
    // locations, leads
    // cslService.getCSLData('data').subscribe(data => console.log(data));
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit() {
    this.location = [
      { LocationId: 1, LocationName: 'Liverpool' },
      { LocationId: 2, LocationName: 'Budapest' },
      { LocationId: 3, LocationName: 'Cleveland' },
      { LocationId: 4, LocationName: 'Marburg' }
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
      enableCheckAll: false
    };

    this.headData = [
      { headId: 1, Name: 'Adrian Aeschlimann', Id: 3 },
      { headId: 2, Name: 'Barbara Moser', Id: 4 },
      { headId: 3, Name: 'Juerg Hofmaenner', Id: 2 },
      { headId: 4, Name: 'Katharine von der Fecht', Id: 1 },
    ];
    this.dropdownHeadSettings = {
      singleSelection: true,
      idField: 'headId',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      enableCheckAll: false
    };

    this.persons = [
      { headId: 1, Id: 1, FirstName: 'Edgar Thenier', LastName: 'Demon' },
      { headId: 2, Id: 2, FirstName: 'Jasmin Fröhlich', LastName: 'Kimbell', HasJobsAssociated: true },
      { headId: 2, Id: 3, FirstName: 'Livia Schuepbach', LastName: 'Shaw', HasJobsAssociated: true },
      { headId: 3, Id: 1, FirstName: 'Meseret Eshetu', LastName: 'Benoff', HasJobsAssociated: true },
      { headId: 3, Id: 2, FirstName: 'Nelson Magrini', LastName: 'Hanks' },
      { headId: 3, Id: 3, FirstName: 'Patrick Studer', LastName: 'Demon' },
      { headId: 4, Id: 1, FirstName: 'Renate Guenter-Balga', LastName: 'Zest', HasJobsAssociated: true },
      { headId: 4, Id: 2, FirstName: 'Stefan Althaus', LastName: 'Dawn' },
      { headId: 4, Id: 3, FirstName: 'Ute Kallweit', LastName: 'Crew' },
      { headId: 4, Id: 1, FirstName: 'Regula Heini Hodel', LastName: 'Danny', HasJobsAssociated: true },
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

  onLocationSelect(item: any) {
    const self = this;
    self.response.Location = item;
    this.selectedHead = _.filter(self.headData, function (obj) {
      if (obj.Id === item.LocationId) {
        return obj;
      }
    });
    this.onHeadSelect(this.selectedHead[0]);
  }

  onHeadSelect(item: any) {
    const self = this;
    self.response.Head = item;
    this.personsByLocation = _.filter(self.persons, function (obj) {
      if (obj.headId === item.headId) {
        return obj;
      }
    });
  }

  onPersonSelect(item: any) {
    const self = this;
    self.response.Person = item;
    self.selectedJobs = _.filter(self.job, function (obj) {
      if (obj.PersonId === item.Id) {
        console.log(obj);
        self.response.Job.push(obj);
        return obj;
      }
    });
    console.log(self.selectedJobs);
    console.log(self.response);
  }

  onJobSelect(item: any) {
    const self = this;
    self.response.Job.push(item);
    console.log(self.response);
  }

  onRoleSelect(item: any) {
    const self = this;

    self.selectedJobs = [];
    self.response.Job = [];

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
  }

  onBackupSelect(item: any) {
    this.response.Backup.push(item.id);
    console.log(item);
  }


  onDeselct(item: any, category: any) {
    const self = this;
    if (category === 'Location') {
      self.clearData();
    } else if (category === 'head') {
      self.response.Head = {};
      self.response.Person = {};
      self.response.Job = [];
      self.response.Role = [];
      self.response.Backup = [];
      self.selectedJobs = [];
      self.selectedRoles = [];
      self.selectedBackups = [];
      self.selectedHead = [];
    } else if (category === 'Person') {
      self.response.Person = {};
      self.response.Job = [];
      self.response.Role = [];
      self.response.Backup = [];
      self.selectedJobs = [];
      self.selectedRoles = [];
      self.selectedBackups = [];
    } else if (category === 'Job') {

      self.response.Job = _.filter(self.response.Job, function (obj) {
        return obj.JobId !== item.JobId;
      });
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

  addRow() {
    this.toasterService.pop('success', 'Success!', 'Record Added Successfully!');
    const self = this;
    this.flag = true;
    self.response.Role = _.uniq(self.response.Role);
    const roleNames = [];
    const tableData = {};
    tableData['location'] = self.response.Location['LocationName'];
    tableData['name'] = self.response.Person['FirstName'];
    tableData['head'] = self.response.Head['Name'];
    tableData['roleName'] = 'NA';
    tableData['jobName'] = 'NA';
    tableData['backup'] = 'NA';

    if (self.response.Job.length === 0) {
    _.forEach(self.roles, function (obj) {
      if (_.includes(self.response.Role, obj.RoleId)) {
        roleNames.push(obj.RoleName);
        let o = _.cloneDeep(tableData);
        _.each(self.backup, function(bo) {
          if (obj.backupsIds[0] === bo.id) {
            o['backup'] = bo.FirstName;
          }
        });

        o['roleName'] = obj.RoleName;
        self.tableContent.push(o);
      }
    });

  } else if (self.response.Job.length > 0) {
      _.forEach(self.response.Job, function (obj) {
        let o = _.cloneDeep(tableData);
        o['jobName'] = obj.JobName;
        self.tableContent.push(o);
      });
    }
    this.source = new LocalDataSource(this.tableContent);
    this.source.refresh();
    this.clearData();
  }

  clearData() {
    const self = this;
    self.response = {
      Location: {},
      Head: {},
      Person: {},
      Job: [],
      Role: [],
      Backup: []
    };
    self.selectedHead = [];
    self.selectedLocation = [];
    self.personsByLocation = [];
    self.selectedPersons = [];
    self.selectedJobs = [];
    self.selectedRoles = [];
    self.selectedBackups = [];
  }

  deleteRow() {
    const self = this;
    _.pullAll(self.tableContent, self.selectedRows);
    self.source = new LocalDataSource(self.tableContent);
    self.source.refresh();
    this.selectedRows = [];
    this.toasterService.pop('warning', 'Success!', 'Records Deleted Successfully!');
  }

  onUserRowSelect(event) {
    this.selectedRows = event.selected;
    console.log(event);
  }

  resetGrid() {
    this.tableContent = [];
    this.source = new LocalDataSource(this.tableContent);
    this.source.refresh();
  }

  confirm(): void {
    this.modalRef.hide();
    this.resetGrid();
  }

  decline(): void {
    this.modalRef.hide();
  }
}
