import React from 'react';
import {Table} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import config from './components/config/blueprint.json';
const { Column, HeaderCell, Cell, Pagination } = Table;
const bp= config.data;
export type ResiableTableProps= {
  data?:any;
  id?:number;
}
const ResizableTable = (props:ResiableTableProps) => {
    return (
      <div>
         <Table height={420} data={bp.tableData}>
        <Column width={50} align="center" fixed>
    <HeaderCell>{bp.headerdata.title}</HeaderCell>
          <Cell dataKey="id" />
       </Column>
         <Column width={100} resizable>
          <HeaderCell>First Name</HeaderCell>
          <Cell dataKey="firstName" />
        </Column>
        <Column width={100} resizable>
          <HeaderCell>Last Name</HeaderCell>
          <Cell dataKey="lastName" />
        </Column>
        <Column width={200} resizable>
          <HeaderCell>City</HeaderCell>
          <Cell dataKey="city" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell>Company Name</HeaderCell>
          <Cell dataKey="companyName" />
        </Column>
       </Table>
      </div>
    );
  }
export default ResizableTable;
