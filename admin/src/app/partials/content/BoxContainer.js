/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useState } from "react";
import { dedent } from "dentist";
import { Tooltip } from "@material-ui/core";
// https://github.com/conorhastings/react-syntax-highlighter#prism
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// See https://github.com/PrismJS/prism-themes
import { coy as highlightStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
    Portlet,
    PortletBody,
    PortletHeader,
    PortletHeaderToolbar
} from "./Portlet";

export function BoxContainerBasic({afterTitleRight, children, beforeCodeTitle }) {
    const [isCodeVisible, setIsCodeVisible] = useState(false);
    return (
        <Portlet>
            <PortletHeader
                title={beforeCodeTitle}
                toolbar={ afterTitleRight &&
                    <div className="kt-portlet__head-toolbar">
                        <div className="kt-portlet__head-wrapper">
                            <div className="kt-portlet__head-actions">
                                <div className="dropdown dropdown-inline">
                                    {afterTitleRight}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            />

            <PortletBody>
                {children && <div className="kt-portlet__preview">{children}</div>}
            </PortletBody>
        </Portlet>
    );
}
