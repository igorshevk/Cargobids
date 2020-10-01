export function setPageNum(el, view, props){
    let info = el.DataTable().page.info();
    let extra_data = props.extra_data;
    if(extra_data[view] !== undefined)
        extra_data[view].page_no = info.page;
    else
        extra_data[view] = {page_no : info.page};
    props.setExtraData(extra_data);
}

export function getPageNum(view, props) {
    let page = 0;
    let lastPath = props.extra_data.lastPath;
    if(lastPath !== undefined && lastPath.indexOf(props.location.pathname) > -1 && lastPath.indexOf('edit') == -1 && lastPath.indexOf('create') == -1 ) {
        if(props.extra_data[view] !== undefined)
            page = props.extra_data[view].page_no * 10;
    }
    return page;
}