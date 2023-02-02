/**
 * @jest-environment jsdom
 */

Object.defineProperty(window, "django_context", {
  value: {
    user: {
      isSuperuser: true,
    },
  },
  writable: false,
});

import {
  EditableEntry,
  EditableEntryAttrs,
  EditableEntryAttrValue,
} from "../../components/entry/entryForm/EditableEntry";

import { initializeEntryInfo, isSubmittable, convertAttrsFormatCtoS } from "./Edit";

import { DjangoContext } from "services/DjangoContext";

const djangoContext = DjangoContext.getInstance();

test("initializeEntryInfo should return expect value", () => {
  const entity = {
    id: 1,
    name: "TestEntity",
    note: "hoge",
    status: 0,
    isToplevel: true,
    attrs: [
      {
        id: 2,
        index: 0,
        name: "attr",
        type: djangoContext.attrTypeValue.string,
        isMandatory: true,
        isDeleteInChain: true,
      },
    ],
    webhooks: [],
    isPublic: true,
  };
  expect(initializeEntryInfo(entity)).toStrictEqual({
    name: "",
    attrs: {
      attr: {
        id: 2,
        isMandatory: true,
        schema: {
          id: 2,
          name: "attr",
        },
        type: 2,
        value: {
          asArrayGroup: [],
          asArrayNamedObject: [
            {
              "": null,
            },
          ],
          asArrayObject: [],
          asArrayRole: [],
          asArrayString: [""],
          asBoolean: false,
          asGroup: null,
          asNamedObject: {
            "": null,
          },
          asObject: null,
          asRole: null,
          asString: "",
        },
      },
    },
  });
});

test("isSubmittable() returns false when entryInfo.name is null", () => {
  expect(isSubmittable({ name: null, attrs: {} })).toStrictEqual(false);
});

test("isSubmittable() returns true when entryInfo.attrs is changed", () => {
  const cases: Array<{ type: number; value: EditableEntryAttrValue }> = [
    // boolean
    {
      type: djangoContext?.attrTypeValue.boolean,
      value: {
        asBoolean: true,
      },
    },
    // string
    {
      type: djangoContext?.attrTypeValue.string,
      value: {
        asString: "value",
      },
    },
    // object
    {
      type: djangoContext?.attrTypeValue.object,
      value: {
        asObject: {
          id: 1,
          name: "test_object",
          schema: {
            id: 1,
            name: "test_schema",
          },
          _boolean: false,
        },
      },
    },
    // group
    {
      type: djangoContext?.attrTypeValue.group,
      value: {
        asGroup: {
          id: 1,
          name: "test_object",
        },
      },
    },
    // named_object
    {
      type: djangoContext?.attrTypeValue.named_object,
      value: {
        asNamedObject: {
          hoge: {
            id: 1,
            name: "test_object",
            schema: {
              id: 1,
              name: "test_schema",
            },
            _boolean: false,
          },
        },
      },
    },
    // array_string
    {
      type: djangoContext?.attrTypeValue.array_string,
      value: {
        asArrayString: ["value"],
      },
    },
    // array_object
    {
      type: djangoContext?.attrTypeValue.array_object,
      value: {
        asArrayObject: [
          {
            id: 1,
            name: "test_object",
            schema: {
              id: 1,
              name: "test_schema",
            },
            _boolean: false,
          },
        ],
      },
    },
    // array_group
    {
      type: djangoContext?.attrTypeValue.array_group,
      value: {
        asArrayGroup: [
          {
            id: 1,
            name: "test_object",
          },
        ],
      },
    },
    // array_named_object
    {
      type: djangoContext?.attrTypeValue.array_named_object,
      value: {
        asArrayNamedObject: [
          {
            name1: {
              id: 1,
              name: "test_object",
              schema: {
                id: 1,
                name: "test_schema",
              },
              _boolean: false,
            },
          },
        ],
      },
    },

    // TODO role
    // TODO array_role
  ];

  cases.forEach((c) => {
    const attrs: Record<string, EditableEntryAttrs> = {
      key: {
        id: 1,
        type: c.type,
        isMandatory: true,
        schema: {
          id: 1,
          name: "test_schema",
        },
        value: c.value,
      },
    };
    const entryInfo: EditableEntry = { name: "test_entry", attrs: attrs };

    expect(isSubmittable(entryInfo)).toStrictEqual(true);
  });
});

test("isSubmittable() returns false when entryInfo is wrong value", () => {
  const cases: Array<{ type: number; value: EditableEntryAttrValue }> = [
    // string
    {
      type: djangoContext?.attrTypeValue.string,
      value: {
        asString: "",
      },
    },
    // object
    {
      type: djangoContext?.attrTypeValue.object,
      value: {},
    },
    // group
    {
      type: djangoContext?.attrTypeValue.group,
      value: {},
    },
    // named_object
    {
      type: djangoContext?.attrTypeValue.named_object,
      value: {
        asNamedObject: {
          "": {
            id: 1,
            name: "test_object",
            schema: {
              id: 1,
              name: "test_schema",
            },
            _boolean: false,
          },
        },
      },
    },
    // TODO case object is none
    /*
    {
      type: djangoContext?.attrTypeValue.named_object,
      value: {
        asNamedObject: {
          name1: {}
        },
      },
    },
    */
    // array_string
    {
      type: djangoContext?.attrTypeValue.array_string,
      value: {
        asArrayString: [],
      },
    },
    // array_object
    {
      type: djangoContext?.attrTypeValue.array_object,
      value: {
        asArrayObject: [],
      },
    },
    // array_group
    {
      type: djangoContext?.attrTypeValue.array_group,
      value: {
        asArrayGroup: [],
      },
    },
    // named_object
    {
      type: djangoContext?.attrTypeValue.array_named_object,
      value: {
        asArrayNamedObject: [],
      },
    },
    {
      type: djangoContext?.attrTypeValue.array_named_object,
      value: {
        asArrayNamedObject: [
          {
            "": {
              id: 1,
              name: "test_object",
              schema: {
                id: 1,
                name: "test_schema",
              },
              _boolean: false,
            },
          },
        ],
      },
    },
    // TODO case object is none
    /*
    {
      type: djangoContext?.attrTypeValue.array_named_object,
      value: {
        asArrayNamedObject: [
          {
            name1: {}
          },
        ],
      },
    },
    */

    // TODO role
    // TODO array_role
  ];

  cases.forEach((c) => {
    const attrs: Record<string, EditableEntryAttrs> = {
      key: {
        id: 1,
        type: c.type,
        isMandatory: true,
        schema: {
          id: 1,
          name: "test_schema",
        },
        value: c.value,
      },
    };
    const entryInfo: EditableEntry = { name: "test_entry", attrs: attrs };
    console.log("entryInfo", entryInfo);
    expect(isSubmittable(entryInfo)).toStrictEqual(false);
  });
});
test("convertAttrsFormatCtoS() returns expected value", () => {
  const cases: Array<{ client_data: { type: number; value: EditableEntryAttrValue }, expected_data: any}> = [
    // boolean
    {
      client_data: {
        type: djangoContext?.attrTypeValue.boolean,
        value: {
          asBoolean: true,
        },
      },
      expected_data: true,
    },
    // string
    {
      client_data: {
        type: djangoContext?.attrTypeValue.string,
        value: {
          asString: "value",
        },
      },
      expected_data: "value" ,
    },
    // object
    {
      client_data: {
        type: djangoContext?.attrTypeValue.object,
        value: {
          asObject: {
            id: 3,
            name: "test_object",
            schema: {
              id: 2,
              name: "test_schema",
            },
            _boolean: false,
          },
        },
      },
      expected_data: 3,
    },
    // group
    {
      client_data: {
        type: djangoContext?.attrTypeValue.group,
        value: {
          asGroup: {
            id: 2,
            name: "test_object",
          },
        },
      },
      expected_data: 2,
    },
    // named_object
    {
      client_data: {
        type: djangoContext?.attrTypeValue.named_object,
        value: {
          asNamedObject: {
            hoge: {
              id: 2,
              name: "test_object",
              schema: {
                id: 3,
                name: "test_schema",
              },
              _boolean: false,
            },
          },
        },
      },
      expected_data: {
        id: 2,
        name: "hoge",
      },
    },
    // array_string
    {
      client_data: {
        type: djangoContext?.attrTypeValue.array_string,
        value: {
          asArrayString: ["value"],
        },
      },
      expected_data: ["value"],
    },
    // array_object
    {
      client_data: {
        type: djangoContext?.attrTypeValue.array_object,
        value: {
          asArrayObject: [
            {
              id: 2,
              name: "test_object",
              schema: {
                id: 3,
                name: "test_schema",
              },
              _boolean: false,
            },
          ],
        },
      },
      expected_data: [2],
    },
    // array_group
    {
      client_data: {
        type: djangoContext?.attrTypeValue.array_group,
        value: {
          asArrayGroup: [
            {
              id: 2,
              name: "test_object",
            },
          ],
        },
      },
      expected_data: [2],
    },
    // array_named_object
    {
      client_data: {
        type: djangoContext?.attrTypeValue.array_named_object,
        value: {
          asArrayNamedObject: [
            {
              name1: {
                id: 2,
                name: "test_object",
                schema: {
                  id: 3,
                  name: "test_schema",
                },
                _boolean: false,
              },
            },
          ],
        },
      },
      expected_data: [{
        id: 2,
        name: "name1",
      }],
    },
    // role
    {
      client_data: {
        type: djangoContext?.attrTypeValue.role,
        value: {
          asRole: {
            id: 2,
            name: "test_role",
          },
        },
      },
      expected_data: 2,
    },
    // array_role
    {
      client_data: {
        type: djangoContext?.attrTypeValue.array_role,
        value: {
          asArrayRole: [
            {
              id: 2,
              name: "test_role",
            },
          ],
        },
      },
      expected_data: [2],
    },
  ];

  cases.forEach((c) => {
    const attrs: Record<string, EditableEntryAttrs> = {
      key: {
        id: 1,
        type: c.client_data.type,
        isMandatory: true,
        schema: {
          id: 1,
          name: "test_schema",
        },
        value: c.client_data.value,
      },
    };
    const sending_data = convertAttrsFormatCtoS(attrs);

    expect(sending_data).toStrictEqual([{
      id: 1,
      value: c.expected_data,
    }])
  });
});
