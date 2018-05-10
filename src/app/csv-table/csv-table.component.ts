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
      location: {
        title: 'Location',
      },
      supervisors: {
        title: 'Supervisor'
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
      class: 'table table-bordered',
    }
  };

  constructor(toasterService: ToasterService, cslService: CslService, private modalService: BsModalService) {
    this.toasterService = toasterService;
    this.cslService = cslService;
  }

  ngOnInit() {
    this.source = new LocalDataSource(this.tableContent);
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

  addRow() {
    this.toasterService.pop('success', 'Success!', 'Record Added Successfully!');
    this.source = new LocalDataSource(this.tableContent);
    this.source.refresh();
  }

}
