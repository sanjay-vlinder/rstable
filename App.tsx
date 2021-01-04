//@ts-nocheck
import Chance from 'chance';
import faker from 'faker';
import jsf from 'json-schema-faker';
import * as React from 'react';
import {View} from 'react-native';
import {TableHeaderDataProps, TableV} from './src/TableV';
jsf.extend('faker', () => faker);
jsf.extend('chance', () => new Chance());
const schema = {
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        id: {
          $ref: '#/definitions/positiveInt',
        },
        select: {
          $ref: '#/definitions/positiveInt',
        },
        name: {
          type: 'string',
          faker: 'name.findName',
        },
        email: {
          type: 'string',
          chance: {
            email: {
              domain: 'vlinder.io',
            },
          },
        },
        phoneNumber: {
          type: 'string',
          chance: {
            phone: {},
          },
        },
        button: {
          type: 'string',
          faker: 'name.findName',
        },
        buttonColor: {
          type: 'string',
        },
        action: [
          {
            key: {
              type: 'string',
            },
          },
          {
            key: {
              type: 'string',
            },
          },
        ],
      },
      required: ['id', 'name', 'email'],
    },
  },
  required: ['user'],
  definitions: {
    positiveInt: {
      type: 'integer',
      minimum: 0,
      exclusiveMinimum: true,
    },
  },
};
const generateFakeData = async (schema, rows = 1) => {
  let res = [];
  try {
    if (schema) {
      for (let i = 0; i < rows; ++i) {
        const sample = await jsf.resolve(schema);
        let _sample = {...sample.user};
        _sample.avatar = `https://ui-avatars.com/api/?name=${_sample.name}`;
        res.push(_sample);
      }
    }
  } catch (err) {
    console.log('error in fake data generation', err);
  }
  return res;
};
const LENGTH_MENU = [
  {
    value: 10,
    label: 10,
  },
  {
    value: 20,
    label: 20,
  },
];
const columns: TableHeaderDataProps[] = [
  {
    label: 'ID',
    dataKey: 'id',
    summary: 4200,
    summaryFormat: '0,0', //Refer different format http://numeraljs.com/
    summaryStyle: {
      color: 'red',
      fontSize: 20,
    },
    columnProps: {
      width: 120,
      sortable: false,
      fixed: true,
      searchable:true
    },
    labelStyle: {
      color: '#606161',
    },
  },
  {
    label: 'Select',
    dataKey: 'select',
    appearance: 'checkbox',
    appearanceProps: {
      style: {
        // color: '#d3d3d3'
      },
    },
    columnProps: {
      width: 200,
      fixed: true,
      searchable:false
    },
    cellStyle: {
      //  backgroundColor: '#d3d3d3'
    },
    labelStyle: {
      color: '#606161',
    },
  },
  {
    label: 'Full Name',
    dataKey: 'name',
    appearance: 'status',
    appearanceProps: {
      style: {
        // color: '#d3d3d3'
      },
      dotStyle: {
        backgroundColor: 'green',
        borderRadius: 15,
        width: 10,
        height: 10,
        marginRight: 5,
      },
    },
    columnProps: {
      width: 200,
      sortable: false,
      fixed: true,
      searchable:true
    },
    cellStyle: {
      //  backgroundColor: '#d3d3d3'
    },
    labelStyle: {
      color: '#606161',
    },
  },
  {
    label: 'Email',
    dataKey: 'email',
    appearance: 'email',
    columnProps: {
      width: 200,
      float:'left',
      sortable: false,
      resizable: true,
      searchable:true
    },
    labelStyle: {
      color: '#606161',


    },

  },
  {
    label: 'Phone Number',
    dataKey: 'phoneNumber',
    columnProps: {
      width: 200,
      sortable: false,
      resizable: true,
      searchable:true
    },
    labelStyle: {
      color: '#606161',
    },
  },
  {
    label: 'Avatar',
    dataKey: 'avatar',
    appearance: 'avatar',
    columnProps: {
      width: 200,
      searchable:false
    },
    labelStyle: {
      color: '#606161',
    },
  },
  {
    label: 'Button',
    dataKey: 'button',
    appearance: 'button',
    appearanceProps: {
      color: 'orange',
    },
    columnProps: {
      width: 200,
      searchable:false
    },
    labelStyle: {
      color: '#606161',
    },
  },
  {
    label: 'Action',
    dataKey: 'action',
    appearance: 'action',
    appearanceProps: {
      color: 'orange',
    },
    columnProps: {
      width: 200,
      searchable:false
    },
    labelStyle: {
      color: '#606161',
    },
  },
];
export default function App() {
  const [data, setData] = React.useState<any>([]);
  React.useEffect(() => {
    generateFakeData(schema, 15).then(res => {
      console.log('result', res);
      res && Array.isArray(res) && setData([...res]);
    });
  }, []);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fcfcfc',
        height: '100vh',
        width: '100%',
      }}
    >
      <TableV
        // onRowClick={data => console.log("row clicked", data)}
        table={{
          width: 900,
          height: 500,
          headerHeight: 80,
          // rowHeight: 50,
          wordWrap: true,
          //cellBordered: true,
          data: [...data],
        }}
        checkedAppearance={true}
        evenRowColor={'#d3d3d3'}
        columns={columns}
        onPress={key => console.log('button Pressed', key)}
        onSelectRow={checkedKeys => console.log('checked Keys', checkedKeys)}
        // pagination={{
        //   lengthMenu: LENGTH_MENU
        // }}
      />
    </View>
  );
}
