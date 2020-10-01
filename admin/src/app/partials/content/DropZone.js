import React from 'react';
import {useDropzone} from 'react-dropzone';
import {formatBytes} from "../../helpers/commons";

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

export default function DropZone({dropZoneText = null, multiple=true, onDrop = () => {}}) {
    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        multiple,
        onDrop
    });

    const style = React.useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject
    ]);

    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {formatBytes(file.size)}
        </li>
    ));

    return (
        <div className="container">
            <div {...getRootProps({style})}>
                <input {...getInputProps()} />
                {dropZoneText || <p>Drag 'n' drop some files here, or click to select files</p>}
            </div>
            {
                files && files.length > 0 && <aside style={{marginTop: "10px"}}>
                    <h4>Files</h4>
                    <ul>{files}</ul>
                </aside>
            }
        </div>
    );
}