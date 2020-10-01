/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, {Component, lazy, useCallback} from "react";
import {Button, Modal, OverlayTrigger, Tooltip} from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import {ucFirst, make_cols} from "../../../../app/helpers/commons";
import XLSX from 'xlsx';
import {importData} from "../../../../app/crud/api";
import notify from "../../../../app/helpers/Notifications";

// import fs from "fs";

// import Dropzone from 'react-dropzone'

// import {useDropzone} from 'react-dropzone';

import Dropzone from '../../../../app/partials/content/DropZone'

const QuickActionsDropdownToggle = React.forwardRef((props, ref) => {
    return (
        <a
            ref={ref}
            href="#"
            onClick={e => {
                e.preventDefault();
                props.onClick(e);
            }}
            id=""
            className="btn btn-danger kt-subheader__btn-options"
        >
            Import
        </a>
    );
});

export class QuickActions extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            importType:null,
            export:{
                file:{},
                data:[],
                cols:[]
            }
        };
    }


    handleImportModalClose = () => {
        this.setState({showModal: false});
    };

    handleImportModalShow = (type) => {
        this.setState({
            showModal: true,
            importType: type,
            importExcel:{
                file:{},
                data:[],
                cols:[]
            }
        });
    };


    handleImport = () => {

        let {importType,importExcel:{data,cols}} = this.state;
        let model = '';

        if(!importType) {
            notify.error('Failed to fetch the import type');
            return false;
        }

        switch(importType){
            case 'agents':
                model='agent';
                break;
            case 'airlines':
                model='airline';
                break;
            default:
                notify.error('Invalid import type provided');
        }

        if(!data) {
            notify.error('Failed to import file data');
        }

        //Finally send the Import data.
        importData(data,cols, ucFirst(model))
            .then(res => {
                if(res.status && res.status === 200) {
                    let {data:{success, message}} = res;

                    if(success) {
                        notify.success(message);
                        this.setState({
                            showModal:false,
                            importType:null,
                            importExcel:{
                                file:{},
                                data:[],
                                cols:[]
                            }
                        })
                    }
                } else {
                    notify.error('Failed to Import data');
                }
            })
            .catch(reason => {
                let {response} = reason;

                if(response) {
                    let {data: {error}} = response;
                    notify.error(error);
                } else {
                    notify.error('Failed to import the excel file');
                }
            });
    };

    onDrop = (acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            //setting up file reader
            const reader = new FileReader();
            const rABS = !!reader.readAsBinaryString;
            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');
            reader.onload = (evt) => { // evt = on_file_select event
                /* Parse data */
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true });

                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];

                //We need to map the excel column names to db column names, it will help us import specific excel columns to the database.
                let renames = {
                    'Name' : 'agent_company_name',
                    'City': 'city',
                    'Address1':'address_1',
                    'Address2':'address_2',
                    'CodeIATA': 'iata',
                    // 'CodeCASS':'branch'
                };
                let cols = this.get_header_row(ws, renames);
                /* Convert array of arrays */
                let data = XLSX.utils.sheet_to_json(ws,{header:1}); //header 1 tells that response should be array of arrays not array of objects.

                data.map((row,index)=>{
                    //row[1] is iata, need to update it, as it should contains 11 characters, column A and column B of excel.
                    row[1] = row[1] + row[2];
                    return row;
                });

                /* Update state */
                this.setState({ importExcel:{data, cols: cols} }, () => {
                    // console.log(JSON.stringify(this.state.importExcel.data, null, 2));
                });
            };

            if (rABS) {
                reader.readAsBinaryString(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        });

    };

    get_header_row = (sheet, renames={}) =>  {
        let headers = [];
        let range = XLSX.utils.decode_range(sheet['!ref']);
        let C, R = range.s.r; /* start in the first row */
        /* walk every column in the range */
        for(C = range.s.c; C <= range.e.c; ++C) { //s is start, c is column so first column, e is end so end column
            let cell = sheet[XLSX.utils.encode_cell({c:C, r:R})] /* find the cell in the first row */

            let hdr = "UNKNOWN " + C; // <-- replace with your desired default

            if(renames && cell && cell.t){
                hdr = XLSX.utils.format_cell(cell);
                if(renames[hdr])
                    hdr = renames[hdr];

                console.log('cell',hdr);
            }else if(cell && cell.t) {
                hdr = XLSX.utils.format_cell(cell);
            }
            headers.push(hdr);
        }
        return headers;
    };

    render() {
        return (
            <>
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="quick-actions-tooltip">Quick actions</Tooltip>}
                >
                    <Dropdown className="dropdown-inline" drop="down" alignRight>
                        <Dropdown.Toggle
                            as={QuickActionsDropdownToggle}
                            id="dropdown-toggle-quick-actions-subheader"
                        />

                        <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                            <a className="dropdown-item" href="#" onClick={e=>this.handleImportModalShow('agents')}>
                                <i className="la la-user"></i> Agents List (xls)
                            </a>
                            <a className="dropdown-item" href="#" onClick={e=>this.handleImportModalShow('airlines')}>
                                <i className="la la-user"></i> Airlines List (xls)
                            </a>
                            {/*
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="#">
                <i className="la la-cog"></i> Settings
              </a>*/}
                        </Dropdown.Menu>
                    </Dropdown>
                </OverlayTrigger>


                <Modal
                    show={this.state.showModal}
                    onHide={this.handleImportModalClose}
                    size="lg"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Import {this.state.importType? ucFirst(this.state.importType): ''}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Dropzone multiple={false} onDrop={this.onDrop} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleImportModalClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleImport}>
                            Import Files
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}
