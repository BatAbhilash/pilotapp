import { Component, OnInit, TemplateRef,  Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { ToasterModule, ToasterService } from 'angular5-toaster';
import { CslService } from '../../app/csl.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-csv-table',
  templateUrl: './csv-table.component.html',
  styleUrls: ['./csv-table.component.css']
})
export class CsvTableComponent implements OnInit {
  @Input() tableContent;
  modalRef: BsModalRef;
  source: LocalDataSource;
  toasterService: ToasterService;
  cslService: CslService;
  loading: Boolean;
  response = {
    Location: {},
    Head: {},
    Person: [],
    Job: [],
    Role: [],
    Backup: []
  };
  selectedRows = [];

  settings = {
    selectMode: 'multi',
    hideSubHeader: true,
    actions: {
      delete: false,
      add: false,
      edit: false,
      select: true,
    },
    columns: {
      Location: {
        title: 'Location',
      },
      Supervisors: {
        title: 'Supervisor'
      },
      Name: {
        title: 'Person'
      },
      JobName: {
        title: 'Job'
      },
      RoleName: {
        title: 'Role'
      },
      Backup: {
        title: 'Backup'
      },
      Status: {
        title: 'Status'
      }
    },
    defaultStyle: false,
    attr: {
      class: 'table table-bordered',
    }
  };

  constructor(toasterService: ToasterService, cslService: CslService, private modalService: BsModalService) {
    this.toasterService = toasterService;
    this.cslService = cslService;
  }

  ngOnInit() {
    this.source = new LocalDataSource(this.tableContent);
    console.log(this.tableContent);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  clearData() {
    const self = this;
    self.response = {
      Location: {},
      Head: {},
      Person: [],
      Job: [],
      Role: [],
      Backup: []
    };
    // self.selectedHead = [];
    // self.selectedLocation = [];
    // self.selectedPersons = [];
    // self.selectedJobs = [];
    // self.selectedRoles = [];
    // self.selectedBackups = [];
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
    const self = this;
    self.tableContent = [];
    self.source = new LocalDataSource(self.tableContent);
    self.source.refresh();
  }

  confirm(): void {
    this.modalRef.hide();
    this.resetGrid();
  }

  decline(): void {
    this.modalRef.hide();
  }

  addRow() {
    console.log(this.tableContent);
    this.toasterService.pop('success', 'Success!', 'Record Added Successfully!');
    this.source = new LocalDataSource(this.tableContent);
    this.source.refresh();
  }

  submitData() {
    const self = this;
    self.loading = true;
    const requestObj = {
      'modelToSave': self.tableContent,
      'Token': localStorage.getItem('token')
    };
    self.cslService.getCSLData('UpdateAris', requestObj)
    .subscribe(obj => {

      _.pullAll(self.tableContent, self.tableContent);
      self.source = new LocalDataSource(self.tableContent);
      self.source.refresh();
      self.selectedRows = [];
      self.loading = false;
      self.toasterService.pop('success', 'Success!', 'Records Saved Successfully!');
    }, err => {
      console.log(err);
      self.loading = false;
      self.toasterService.pop('error', 'error!', 'Something went wrong!');
    });

    // this.toasterService.pop('success', 'Success!', 'Records Saved Successfully!');
  }
}
