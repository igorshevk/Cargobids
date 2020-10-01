import React, {Component} from "react";
import Notice from "../../partials/content/Notice";
import {BoxContainerBasic} from "../../partials/content/BoxContainer";
import {Link, withRouter} from "react-router-dom";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import {Button, Dropdown, Modal, Tab, Tabs, Nav, Col, Row, Form} from "react-bootstrap";
import {API_URL,headers, del} from "../../crud/api";
import ReactDOM from 'react-dom'
import {getUserRoleFromGroupID, URL_PREFIX} from "../../constants/defaultValues"
import DataTable from 'datatables.net-bs4';
import {getRoles,getDateWithFormat} from "../../helpers/commons";
const $ = require('jquery');



// $.DataTable = require('datatables.net-responsive-bs4');

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

const buttons = <Link to={"/"+URL_PREFIX+"/subscribers/add"} className="btn btn-clean btn-icon-sm">
        <i className="fa fa-plus"></i>
        New Record
    </Link>;

class SubscriberList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table: false,
            rows: [],
            show: false,
            userIndex: 0,
            action: {},
            orderCol:1,
            orderType:'asc'
        }
        this.getMembershipTableData = this.getMembershipTableData.bind(this);
    }

    componentDidMount() {
        this.getMembershipTableData();
    }



    handleModalClose(event) {
        this.setState({show:false, });
    }


    handleModalShow(event, index, act) {
        this.setState({
                    userIndex:index,
                    show:true,
                    action:act
                });
    }

    confirm(event) {
        if(this.state.action == 'delete') {
            del('subscriptions/'+this.state.rows[this.state.userIndex].id+'/').then(function (response) {
                let rowsData = this.state.rows.filter((v,i) => i !== this.state.userIndex);
                this.setState({
                    rows:rowsData,
                    show:false,

                });
                this.updateTable();
            })
        }
    }

    updateTable() {
        let table = $('#subscriptionListTable').DataTable();
        table.ajax.reload(null, false);
    }


    getMembershipTableData() {
        let $this = this;
        let subscriptionListTableSelector = $('#subscriptionListTable'),
            url = API_URL + 'subscriptions?format=datatables';
        let columnDefs = [
            {
                targets: 0,
                title:"#",
                orderable: false,
            },
            {targets:1,},
            {targets:2,},
            {targets:3,},
            {targets:4, className:'text-center'},
            {targets:6, searchable:false, orderable:false, className:'text-center'},
            {targets:7, searchable:false, orderable:false, className:'text-center'},
            {targets:11, visible:false},

        ];


        columnDefs.push({
            targets: 10,
            title: 'Actions',
            orderable: false,
            searchable:false,
            "createdCell": function (td, cellData, rowData, row, col) {
                ReactDOM.render(
                    <Dropdown className="kt-header__topbar-item" drop="down">
                        <Dropdown.Toggle as={ActionsDropdownToggle} />
                        <Dropdown.Menu  className="dropdown-menu-fit dropdown-menu-anim dropdown-menu-top-unround">
                            <Dropdown.Item onClick={() => $this.props.history.push("/"+URL_PREFIX+'/subscribers/'+rowData.id+'/edit') }><i className="flaticon2-edit"></i> Edit Details</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => $this.handleModalShow(e, row, 'delete')}><i className="flaticon2-trash"></i> Remove</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    , td
                );
            }
        });
        let oTable = subscriptionListTableSelector.DataTable({
            processing: true,
            serverSide: true,
            orderCellsTop: true,
            order: [[ $this.state.orderCol, $this.state.orderType ]],
            dom: 'rftip',
            ajax: {
                url,
                type: "GET",
                headers: {/*'Content-Type': 'application/json', */'Authorization': 'Token '+JSON.parse(localStorage.getItem('persist:cargobid-auth')).authToken.replace(/['"]+/g, '')},
                // headers,
                "dataFilter": function(data) {
                    let json = JSON.parse(data);
                    let rowData = $this.parseRowData(json.data);
                    $this.setState({rows:rowData});
                    json.data = rowData;
                    return JSON.stringify(json); // return JSON string
                },
                data: function ( d ) {
                    return $.extend({}, d, {
                        // "userStatus": $('#user_status').val(),
                        // "roles": $('#user_roles').val(),
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
            },
            initComplete: function () {
                this.api().columns().every( function () {
                    var column = this;
                    var select = $('<select><option value=""></option></select>')
                        .appendTo( $(column.footer()).empty() )
                        .on( 'change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
     
                            column
                                .search( val ? '^'+val+'$' : '', true, false )
                                .draw();
                        } );
     
                    column.data().unique().sort().each( function ( d, j ) {
                        select.append( '<option value="'+d+'">'+d+'</option>' )
                    } );
                } );
        }
        });
    }

    //This Executes before the ColumnDefs
    parseRowData(rowData) {
        let updatedRowData = null;
        if( Array.isArray(rowData) && rowData.length > 0) {
            updatedRowData = rowData.map((row,i)=>{
                rowData[i]['membership__name'] = row.membership.name;
                rowData[i]['user__firstname'] = row.user.firstname;
                rowData[i]['user__lastname'] = row.user.lastname;
                rowData[i]['user__email'] = row.user.email;
                rowData[i]['current_period_start'] = getDateWithFormat(new Date(row.current_period_start));
                let end_date = getDateWithFormat(new Date(row.current_period_end), 'YYYY-MM-DD')
                if (new Date(end_date).getTime() < new Date().getTime())
                    rowData[i]['current_period_end'] = `<strong class="text-danger">${getDateWithFormat(new Date(row.current_period_end))}</strong>`
                else
                    rowData[i]['current_period_end'] = getDateWithFormat(new Date(row.current_period_end));

                rowData[i]['trial_period'] = row.trial_period > 0 ? '<i class="flaticon2-check-mark text-success"></i>':'-'
                rowData[i]['type_stripe'] = row.payment_type === 'Stripe' ? '<i class="flaticon2-check-mark text-success"></i>':'-'
                rowData[i]['type_bank_transfer'] = row.payment_type === 'Bank Transfer' ? '<i class="flaticon2-check-mark text-success"></i>':'-'
                rowData[i]['interval'] = row.interval_count+' '+row.interval+(row.interval_count > 1 ? 's':'');
                //For Additional Columns
                rowData[i]['actions'] = '';
                return row;
            });
        }
        return updatedRowData? updatedRowData: rowData;
    }

    render() {
        return (
            <>
                <Notice icon="flaticon-warning kt-font-primary">
                    This page shows the user current membership.
                    Previous memberships histories also available here......
                </Notice>
                <div className="row">
                    <div className="col-md-12">
                        <BoxContainerBasic beforeCodeTitle="Subscribers">
                            <div className="kt-section">
                              <Row>
                                  <Col sm={6}>All the previous subscriptions for this user will be listed here.</Col>
                                  <Col sm={2} className="text-right">
                                      <span style={{top:'10px',position:'relative'}}>Ordina:</span>
                                  </Col>
                                  <Col sm={2}>
                                      <select
                                          className="border-dark form-control"
                                          placeholder='search'
                                          onChange={(e) => this.setState({orderCol:e.target.value}, () => {
                                                let table = $('#subscriptionListTable').dataTable();
                                                table.fnSort( [[ parseInt(this.state.orderCol), this.state.orderType ]] );
                                             })}
                                          style={{height:44}}
                                      >
                                          <option value="1">Name</option>
                                          <option value="2">Surname</option>
                                          <option value="3">Email</option>
                                          <option value="4">Trial</option>
                                          <option value="5">Plan</option>
                                          <option value="11">Payment Method</option>
                                          <option value="8">Start Date</option>
                                          <option value="9">Exp Date</option>
                                      </select>
                                  </Col>
                                  <Col sm={2}>
                                      <select
                                          className="border-dark form-control"
                                          placeholder='search'
                                          onChange={(e) => this.setState({orderType:e.target.value}, () => {
                                                let table = $('#subscriptionListTable').dataTable();
                                                table.fnSort( [[ parseInt(this.state.orderCol), this.state.orderType ]] );
                                            })}
                                          style={{height:44}}
                                          >
                                          <option value="asc">Crescente</option>
                                          <option value="desc">Decrescente</option>
                                          on>
                                      </select>
                                  </Col>
                              </Row>
                                <div className="kt-separator kt-separator--dashed"></div>
                                <table className="table table-striped- table-bordered table-hover table-checkable"
                                       id="subscriptionListTable">
                                    <thead>
                                    <tr>
                                        <th data-data="id">#</th>
                                        <th data-name="user.firstname" data-data="user__firstname">Name</th>
                                        <th data-data="user__lastname">Surname</th>
                                        <th data-data="user__email">Email</th>
                                        <th data-data="trial_period">Trial</th>
                                        <th data-data="membership__name">Plan</th>
                                        <th data-data="type_stripe">Stripe</th>
                                        <th data-data="type_bank_transfer">Bank Transfer</th>
                                        <th data-name="current_period_start" data-data="current_period_start">Start Date</th>
                                        <th data-name="current_period_end" data-data="current_period_end">Exp Date </th>
                                        <th data-data="actions">Actions<span data-toggle="tooltip" data-title="Activated by Admin"><i className="fa fa-question"></i></span></th>
                                        <th data-data="payment_type">Stripe</th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                        </BoxContainerBasic>
                    </div>
                </div>
                <Modal show={this.state.show} onHide={this.handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.confirm}>
                            Yes
                        </Button>
                        <Button variant="success" onClick={this.handleModalClose}>
                            No
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default withRouter(SubscriberList);