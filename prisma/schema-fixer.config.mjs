export default {
  rules: {
    "model-name": [
      {
        case: "pascal",
        form: "singular",
      },
    ],
    "model-map": [
      {
        case: "snake",
        form: "plural",
      },
    ],
    "field-name": [
      {
        case: "camel",
      },
    ],
    "field-map": [
      {
        case: "snake",
      },
    ],
    "field-attribute": [
      {
        typeToAttributes: {
          DateTime: ["@db.Timestamptz()"],
        },
      },
    ],
    "enum-name": [
      {
        case: "pascal",
        form: "singular",
      },
    ],
    "enum-map": [
      {
        case: "snake",
        form: "plural",
      },
    ],
  },
};
