import React, {useState, useEffect} from "react";
import Notice from "../../partials/content/Notice";
import {BoxContainerBasic} from "../../partials/content/BoxContainer";
import {useHistory} from "react-router-dom";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import {Button, Dropdown, Modal} from "react-bootstrap";
import {API_URL,headers, del} from "../../crud/api";
import ReactDOM from 'react-dom'
import {getUserRoleFromGroupID, URL_PREFIX} from "../../constants/defaultValues"
import DataTable from 'datatables.net-bs4';
import {Link} from 'react-router-dom';
const $ = require('jquery');



// $.DataTable = require('datatables.net-responsive-bs4');

export default function AgentsList(props) {
    const [table, setTable] = React.useState(false); // selected action
    const [rows, setRowsData] = React.useState([]);
    const [show, setModalDisplay] = React.useState(false); // set modal to show/hide
    const [agentIndex, setUser] = React.useState(0); //selected agent to perform actions
    const [action, setAction] = React.useState({}); // selected action
    let history = useHistory();

    const ActionsDropdownToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            ref={ref}
            onClick={e => {
                e.preventDefault();
                onClick(e);
            }}
            id="kt_dashboard_daterangepicker"
            className="btn btn-sm btn-clean btn-icon btn-icon-md"
        >
            {" "}
            <i className="la la-ellipsis-h"></i>
        </a>
    ));


    function handleModalClose(event) {
        setModalDisplay(false);
    }


    function handleModalShow(event, index, act) {
        setUser(index);
        setAction(act)
        setModalDisplay(true);
    }

    function confirm(event) {
        if(action == 'delete') {
          del('agents/'+rows[agentIndex].id+'/').then(function (response) {
            let rowsData = rows.filter((v,i) => i !== agentIndex);
            setRowsData(rowsData);
            setModalDisplay(false);
            updateTable();
          })
        }
    }

    function updateTable() {
        const table = $('#agentsListTable').DataTable();
        table.ajax.reload(null, false);
    }


    function getUsersTableData() {
        let agentsListTableSelector = $('#agentsListTable'),
            url = API_URL + 'agents?format=datatables';
        let columnDefs = [
            {
                targets: 0,
                title:"#",
                orderable: false,
            },
            {
                targets: 5,
                title:'Is Active',
                "createdCell": function (td, cellData, rowData, row, col) {
                    let btnClass,btnText;

                    if (rowData.is_active) {
                        btnClass = 'success';
                        btnText = 'Activated';
                    } else {
                        btnClass = 'danger';
                        btnText = 'Not Active'
                    }
                    ReactDOM.render(
                        <span className={"btn btn-bold btn-sm btn-font-sm  btn-label-"+btnClass}>{btnText}</span>,
                        td
                    )
                }
            },
        ];

        columnDefs.push({
            targets: 6,
            title: 'Actions',
            orderable: false,
            searchable:false,
            "createdCell": function (td, cellData, rowData, row, col) {
                ReactDOM.render(
                    <Dropdown className="kt-header__topbar-item" drop="down">
                        <Dropdown.Toggle as={ActionsDropdownToggle} />
                        <Dropdown.Menu  className="dropdown-menu-fit dropdown-menu-anim dropdown-menu-top-unround">
                            <Dropdown.Item onClick={() => history.push("/"+URL_PREFIX+"/agents/"+rowData.id+"/edit") }><i className="flaticon2-edit"></i> {rowData.is_active?'Edit Details':'Edit & Activate'}</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => handleModalShow(e, row, 'delete')}><i className="flaticon2-trash"></i> Remove</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    , td
                );
            }
        });

        let oTable = agentsListTableSelector.DataTable({
            processing: true,
            serverSide: true,
            order: [[ 0, "desc" ]],
            dom: 'rftip',
            ajax: {
                url,
                type: "GET",
                headers: {/*'Content-Type': 'application/json', */'Authorization': 'Token '+JSON.parse(localStorage.getItem('persist:cargobid-auth')).authToken.replace(/['"]+/g, '')},
                // headers,
                "dataFilter": function(data) {
                    let json = JSON.parse(data);
                    let rowData = parseRowData(json.data);
                    setRowsData(rowData);
                    json.data = rowData;
                    return JSON.stringify(json); // return JSON string
                },
                data: function ( d ) {
                    return $.extend({}, d, {
                        // "agentActivation": $('#agent_activation').val(),
                        // "agentStatus": $('#agent_status').val(),
                        // "roles": $('#agent_roles').val(),
                    });
                }
            },
            responsive: true,
            columnDefs,
            fnRowCallback: function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $(nRow).attr("data-id",aData.id);
                /*if(aData.status.indexOf('Deleted') !== -1) {
                    // $(nRow).addClass('redRowDT');
                    $('td', nRow).css('background-color', '#FFCCCC');
                }*/

                console.log('fnRowCallBack',aData.agent_company);
                return nRow;
            }
        });
    }

    //This Executes before the ColumnDefs
    function parseRowData(rowData) {
        let updatedRowData = null;
        if( Array.isArray(rowData) && rowData.length > 0) {
            updatedRowData = rowData.map((row,i)=>{

               /* let agentRole = getUserRoleFromGroupID(row.groups[0]);
                if(row.email_verified)
                    row.email_verified = '<span class="btn btn-bold btn-sm btn-font-sm  btn-label-success">Verified</span>';
                else
                    row.email_verified = '<span class="btn btn-bold btn-sm btn-font-sm  btn-label-danger">Not Verified</span>';

                rowData[i]['agent_company__agent_company_name'] = rowData[i]['agent_company__branch'] = rowData[i]['agent_company__iata'] = ''
                rowData[i]['airline_company__airline_company_name'] = rowData['airline_company__branch'] = '';
                rowData[i]['company_name'] = rowData['branch'] = '';
                rowData[i]['groups__name'] = agentRole;

                if(agentRole === 'Agent') {
                    rowData[i]['company_name'] = rowData[i]['agent_company__agent_company_name'] = row.agent_company.agent_company_name
                    rowData[i]['branch'] = row.agent_company.branch
                    rowData[i]['agent_company__iata'] = row.agent_company.iata
                }
                else if(agentRole === 'Airline') {
                    rowData[i]['company_name'] = rowData[i]['airline_company__airline_company_name'] = row.airline_company.airline_company_name
                    rowData[i]['branch'] = row.airline_company.branch
                }


                //For Additional Columns*/
                rowData[i]['actions'] = '';
                return row;
            });
        }
        return updatedRowData? updatedRowData: rowData;
    }

    useEffect(() => {
        if (!table) {
            getUsersTableData();
            setTable(true);
        }
    }, []);

    const buttons = <Link to={"/"+URL_PREFIX+"/agents/add"} className="btn btn-clean btn-icon-sm">
            <i className="fa fa-plus"></i>
            New Record
        </Link>;
    return (
        <>
            <Notice icon="flaticon-warning kt-font-primary">
                This page shows Listings for the agent companies,
            </Notice>

            <div className="row">
                <div className="col-md-12">
                    <BoxContainerBasic beforeCodeTitle="Agents List" afterTitleRight={buttons}>
                        <div className="kt-section">
                            <div className="kt-separator kt-separator--dashed"></div>
                            <table className="table table-striped- table-bordered table-hover table-checkable"
                                   id="agentsListTable">
                                <thead>
                                <tr>
                                    <th data-data="id">#</th>
                                    <th data-data="agent_company_name">Name</th>
                                    <th data-data="iata">Iata</th>
                                    <th data-data="branch">Branch</th>
                                    <th data-data="city">City</th>
                                    <th data-data="is_active">Is Active <span data-toggle="tooltip" data-title="Activated by Admin"><i className="fa fa-question"></i></span></th>
                                    <th data-data="actions">Actions<span data-toggle="tooltip" data-title="Activated by Admin"><i className="fa fa-question"></i></span></th>
                                </tr>
                                </thead>
                            </table>
                        </div>
                    </BoxContainerBasic>
                </div>
            </div>
            <Modal show={show} onHide={handleModalClose}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm</Modal.Title>
              </Modal.Header>
              <Modal.Footer>
                <Button variant="danger" onClick={confirm}>
                  Yes
                </Button>
                <Button variant="success" onClick={handleModalClose}>
                  No
                </Button>
              </Modal.Footer>
            </Modal>
        </>
    );
}