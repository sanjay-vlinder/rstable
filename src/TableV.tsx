//@ts-nocheck
import faker from 'faker';
import React, {ReactNode, useState} from 'react';
import {StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import {Icon, Input, InputGroup} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import Avatar from 'rsuite/lib/Avatar';
import Button from 'rsuite/lib/Button';
import Checkbox from 'rsuite/lib/Checkbox';
import Table from 'rsuite/lib/Table';
const numeral = require('numeral');

const {Cell, Column, ColumnGroup, Pagination, HeaderCell} = Table;

var ids = require('short-id');

function deleteKeys(obj: any, keys: string[]) {
  if (obj && keys && Array.isArray(keys)) {
    keys.forEach((key: string) => {
      delete obj[key];
    });

  }
}


// function renameKeys(obj: any, newKeys: any, delete_keys?: string[]) {
//   const keyValues = Object.keys(obj).map(key => {
//     const newKey = newKeys[key] || key;
//     return {[newKey]: obj[key]};
//   });
//   const ret = Object.assign({}, ...keyValues);
//   delete_keys && deleteKeys(ret, delete_keys);
//   return ret;
// }

type TableProps = {
  affixHeader?: boolean | number;
  affixHorizontalScrollbar?: boolean | number;
  autoHeight?: boolean;
  bodyRef?: any;
  bordered?: boolean;
  cellBordered?: boolean;
  data: any[];
  defaultExpandAllRows?: boolean;
  defaultExpandedRowKeys?: string[];
  defaultSortType?: 'desc' | 'asc';
  expandedRowKeys?: string[];
  headerHeight?: number;
  height?: number;
  hover?: boolean;
  isTree?: boolean;
  loading?: boolean;
  minHeight?: number;
  rowClassName?: string | any;
  rowHeight?: number;
  rowExpandedHeight?: number;
  rowKey?: string;
  shouldUpdateScroll?: boolean;
  showHeader?: boolean;
  sortColumn?: string;
  sortType?: 'desc' | 'asc';
  virtualized?: boolean;
  width?: number;
  wordWrap?: boolean;
};

type TableColumnProps = {
  align?: 'left' | 'center' | 'right';
  colSpan?: number;
  fixed?: boolean | 'left' | 'right';
  flexGrow?: number;
  minWidth?: number;
  resizable?: boolean;
  sortable?: boolean;
  treeCol?: boolean;
  verticalAlign?: 'top' | 'middle' | 'bottom';
  width?: number;
  searchable: boolean;

};

type TableColumnGroupProps = {
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  header?: ReactNode;
};

type TableCellProps = {
  dataKey?: string;
  rowData?: object;
  rowIndex?: number;
};

type TablePaginationProps = {
  activePage?: number;
  disabled?: boolean | any;
  displayLength?: number;
  first?: boolean;
  last?: boolean;
  lengthMenu?: any;
  maxButtons?: number;
  next?: boolean;
  prev?: boolean;
  reverse?: boolean;
  showInfo?: boolean;
  showLengthMenu?: boolean;
  total?: number;
};

export type TableHeaderDataProps = {
  label: string;
  dataKey: string;
  appearance?:
    | 'text'
    | 'avatar'
    | 'icon'
    | 'pop-over'
    | 'email'
    | 'edit'
    | 'button'
    | 'checkbox'
    | 'action'
    | 'status';
  appearanceProps?: any;
  summary?: number | string;
  summaryFormat?: any; //supports all formats from http://numeraljs.com/
  summaryControlled?: 'sum' | 'average' | 'percentage'; //TO BE IMPLEMENTED
  summaryStyle?: TextStyle;
  columnProps?: TableColumnProps;
  cellStyle?: any;
  headerCellStyle?: any;
  labelStyle?: TextStyle;

};

export type WidgetProps = {
  table: TableProps;
  columns?: TableHeaderDataProps[];
  columnGroup?: TableColumnGroupProps;
  cell?: TableCellProps;
  checkedAppearance?: boolean;
  oddRowColor?: string;
  evenRowColor?: string;
  pagination?: TablePaginationProps;
  tableContainerStyle?: ViewStyle;
  onDataUpdated?(
    nextData: object[],
    scrollTo: (coord: {x: number; y: number}) => void,
  ): void;
  onExpandChange?(expanded: boolean, rowData: object): void;
  onRowClick?(rowData: object): void;
  onScroll?(scrollX: object, scrollY: object): void;
  onSortColumn?(dataKey: string, sortType: string): void;
  renderEmpty?(info: ReactNode): ReactNode;
  renderLoading?(loading: ReactNode): ReactNode;
  renderRowExpanded?(rowDate?: Object): ReactNode;
  renderTreeToggle?(icon: any, rowData: object, expanded: boolean): any;
  rowHeight?(rowData: object): any;
  onResize?(columnWidth?: number, dataKey?: string): void;
  onChangeLength?(eventKey: number): void;
  onChangePage?(eventKey: number): void;
  onSelectRow?(checkedKeys: any): void;
  renderLengthMenu?(picker: ReactNode): ReactNode;
  renderTotal?(total: number, activePage: number): ReactNode;
  onPress?(eventKey: string): void;
  onActionButtonPress?(rowData: any, itemData: any);
};

const delete_table_keys = [
  'data',
  'sortColumn',
  'sortType',
  'onSortColumn',
  'loading',
];

 export const TableV = (props: WidgetProps) => {
  const [sortState, setSortState] = useState<any>({
    sortColumn: null,
    sortType: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [displayLength, setDisplayLength] = useState<number>();

  const styles = StyleSheet.create({
    statusStyle: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
    },
  });

  const tableProps = props.table ? {...props.table} : {};
  deleteKeys(tableProps, delete_table_keys);

  const onChange = (value, checked) => {
    console.log('value, checked', value);
    const nextCheckedKeys = checked
      ? [...checkedKeys, value]
      : checkedKeys.filter(item => item !== value);
    setCheckedKeys(nextCheckedKeys);
    props.onSelectRow && props.onSelectRow(nextCheckedKeys);
  };

  const handleCheckAll = (value, checked) => {
    const checkedKeys = checked ? props.rowdata.map(item => item.id) : [];
    setCheckedKeys(checkedKeys);
  };

  const onButtonPress = (rowData: any) => {
    props.onPress && props.onPress(rowData);
  };
  const onActionClick = (rowData: any, itemData: any) => {
    props.onActionButtonPress && props.onActionButtonPress(rowData, itemData);
  };

  const getBackgroundColor = (row: number) => {
    if (props.checkedAppearance) {
      if (props.evenRowColor && row % 2 === 0) {
        return {
          backgroundColor: props.evenRowColor,
        };
      }
      if (props.oddRowColor && row % 2 !== 0) {
        return {
          backgroundColor: props.oddRowColor,
        };
      }
    }
  };

  const CustomCell = ({dataKey, rowData, column, ...props}: any) => {
    const {appearance, appearanceProps, cellStyle} = column ?? {};
    if (appearance === 'text') {
      return (
        <Cell
          {...props}
          style={StyleSheet.flatten([
            cellStyle,
            getBackgroundColor(props.rowIndex),
          ])}
        >
          <Text {...appearanceProps}>{rowData[dataKey]}</Text>
        </Cell>
      );
    }
    if (appearance === 'status') {
      return (
        <Cell
          {...props}
          style={StyleSheet.flatten([
            cellStyle,
            getBackgroundColor(props.rowIndex),
          ])}
        >

            <Avatar

              size={'xs'}
              src={faker.internet.avatar}
            />
            <Text {...appearanceProps}>{rowData[dataKey]}</Text>

        </Cell>
      );
    }
    if (appearance === 'checkbox') {
      return (
        <Cell
          {...props}
          style={StyleSheet.flatten([
            cellStyle,
            getBackgroundColor(props.rowIndex),
          ])}
        >
          <Checkbox
            value={rowData[dataKey]}
            inline
            onChange={onChange}
            checked={checkedKeys.some(item => item === rowData[dataKey])}
          />
        </Cell>
      );
    }

    if (appearance === 'action') {
      return (
        <Cell
          {...props}
          style={StyleSheet.flatten([
            cellStyle,
            getBackgroundColor(props.rowIndex),
          ])}
        >
          <span>
            {Array.isArray(rowData[dataKey]) &&
              rowData[dataKey].map((item, index) => {
                if (index === rowData[dataKey].length - 1) {
                  return (
                    <a
                      style={{cursor: 'pointer'}}
                      onClick={() => onActionClick(rowData, item)}
                    >
                      {item.value}
                    </a>
                  );
                } else {
                  return (
                    <>
                      {' '}
                      <a
                        style={{cursor: 'pointer'}}
                        onClick={() => onActionClick(rowData, item)}
                      >
                        {item.value}{' '}
                      </a>{' '}
                      |{' '}
                    </>
                  );
                }
              })}
          </span>
        </Cell>
      );
    }
    if (appearance === 'avatar') {
      return (
        <Cell
          {...props}
          style={StyleSheet.flatten([
            cellStyle,
            getBackgroundColor(props.rowIndex),
          ])}
        >
          {/* <AvatarV
            {...appearanceProps}
            rounded={appearanceProps?.rounded ?? true}
            source={{uri: rowData[dataKey]}}
            avatarStyle={StyleSheet.flatten([appearanceProps?.avatarStyle])}
            containerStyle={StyleSheet.flatten([
              appearanceProps?.containerStyle,
            ])}
          /> */}
          <Avatar
           {...appearanceProps}
           rounded={appearanceProps?.rounded ?? true}
           source={{uri: rowData[dataKey]}}
           avatarStyle={StyleSheet.flatten([appearanceProps?.avatarStyle])}
           containerStyle={StyleSheet.flatten([
             appearanceProps?.containerStyle,
           ])}
          >

          </Avatar>
        </Cell>
      );
    }
    if (appearance === 'email') {
      return (
        <Cell
          {...props}
          style={StyleSheet.flatten([
            cellStyle,
            getBackgroundColor(props.rowIndex),
          ])}
        >
          <a href={`mailto:${rowData[dataKey]}`}>{rowData[dataKey]}</a>
        </Cell>
      );
    }
    if (appearance === 'button') {
      return (
        <Cell
          {...props}
          style={StyleSheet.flatten([
            cellStyle,
            getBackgroundColor(props.rowIndex),
          ])}
        >
          <Button
            {...appearanceProps}
            color={rowData?.buttonColor}
            appearance={appearanceProps.appearance}
            disabled={rowData[dataKey]?.disabled}
            onClick={() => onButtonPress(rowData)}
            id={rowData[dataKey]}
            leftIcon={appearanceProps.leftIcon}
            rightIcon={appearanceProps.rightIcon}
          >
            {rowData[dataKey]}
          </Button>
        </Cell>
      );
    }
    return (
      <Cell
        {...props}
        style={StyleSheet.flatten([
          cellStyle,
          getBackgroundColor(props.rowIndex),
        ])}
        dataKey={dataKey}
      >
        {rowData[dataKey]}
      </Cell>
    );
  };



  const getSearch = (
    searchable?:boolean
  ) => {
    if(searchable === true){
      return (
        <div>
        <InputGroup  >
          <Input />
          <InputGroup.Addon>
            <Icon icon="search" />
          </InputGroup.Addon>
        </InputGroup>
      </div>
      )


    }


  }



  const CustomHeaderCell = ({rowData, column,searchable, ...props}: any) => {
    const {
      label,
      appearance,
      headerCellStyle,
      labelStyle,
    } = column ?? {};


      return (
        <HeaderCell {...props} style={StyleSheet.flatten([headerCellStyle])}>
          <Text style={StyleSheet.flatten([labelStyle])}>{label}</Text>


          {getSearch(searchable)}


        </HeaderCell>

      );



  };




  const renderColumns = (columns?: TableHeaderDataProps[]) => {
    let _columns: any = [];
    if (columns && Array.isArray(columns)) {
      columns.forEach((column, index) => {
        _columns.push(
          <Column
            {...column.columnProps}
            onResize={props.onResize}
            key={ids.generate()}
          >
            <CustomHeaderCell column={column}  searchable />
            <CustomCell column={column} dataKey={column.dataKey} />


          </Column>,
        );
      });
    }
    return _columns;
  };


  const getData = (data: any[], sortColumn: any, sortType: 'asc' | 'desc') => {
    let pageLenght: number = props?.pagination ? 10 : props?.table?.data.length;
    const paeData = data.filter((v, i) => {
      const start = pageLenght * (page - 1);
      const end = start + pageLenght;
      return i >= start && i < end;
    });

    if (sortColumn && sortType && paeData && Array.isArray(paeData)) {
      return paeData.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === 'string') {
          x = x.charCodeAt(0);
        }
        if (typeof y === 'string') {
          y = y.charCodeAt(0);
        }
        if (sortType === 'asc') {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    //data && Array.isArray(data) && setData([...data]);
    return paeData;
  };
  const handleSortColumn = (sortColumn: string, sortType: 'asc' | 'desc') => {
    setLoading(true);
    setTimeout(() => {
      setSortState({
        sortColumn: sortColumn,
        sortType: sortType,
      });
      setLoading(false);
    }, 500);
  };
  const handleChangePage = dataKey => {
    setPage(dataKey);
  };
  const handleChangeLength = dataKey => {
    setPage(1);
    setDisplayLength(dataKey);
  };
  return (
    <View style={StyleSheet.flatten([props.tableContainerStyle])}>

      <Table
        {...tableProps}
        data={getData(
          props.table?.data,
          sortState.sortColumn,
          sortState.sortType,
        )}
        sortColumn={sortState.sortColumn}
        sortType={sortState.sortType}
        onSortColumn={handleSortColumn}
        loading={loading}
        onDataUpdated={props.onDataUpdated}
        onExpandChange={props.onExpandChange}
        onRowClick={props.onRowClick}
        onScroll={props.onScroll}
        renderEmpty={props.renderEmpty}
        renderLoading={props.renderLoading}
        renderRowExpanded={props.renderRowExpanded}
        renderTreeToggle={props.renderTreeToggle}
      >
        {renderColumns(props.columns)}
      </Table>
      {props?.pagination ? (
        <Table.Pagination
          lengthMenu={props.pagination?.lengthMenu}
          activePage={page}
          displayLength={displayLength}
          total={props.table?.data?.length}
          onChangePage={handleChangePage}
          onChangeLength={handleChangeLength}
        />
      ) : null}
    </View>
  );
};

