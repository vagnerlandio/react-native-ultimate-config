const fs = require("fs");
const path = require("path");

const render_env = require("../render-env");

const PROJECT_ROOT = "/home/user1/my_project";
const LIB_ROOT =
  "/home/user1/my_project/node_modules/react-native-ultimate-config";
const D_TS_FILE = `${LIB_ROOT}/index.d.ts`;
const JAVA_VALUES_PATH = `${LIB_ROOT}/android/src/main/java/com/reactnativeultimateconfig/ConfigValues.java`;
const H_VALUES_FILE = `${LIB_ROOT}/ios/ConfigValues.h`;
const XCCONFIG_FILE = `${PROJECT_ROOT}/ios/rnuc.xcconfig`;
const PROPERTIES_FILE = `${PROJECT_ROOT}/android/app/rnuc.properties`;
describe("render_env", () => {
  let map = undefined;
  beforeEach(() => {
    map = render_env(PROJECT_ROOT, LIB_ROOT, {
      MY_VARIABLE: "hello",
      MY_URL: "http://hello.world?howareyoudoing=ok",
    });
  });

  it("returns map of files to write against specifed roots", () => {
    const paths = Object.keys(map);
    expect(paths.includes(D_TS_FILE)).toEqual(true);
    expect(paths.includes(JAVA_VALUES_PATH)).toEqual(true);
    expect(paths.includes(H_VALUES_FILE)).toEqual(true);
    expect(paths.includes(XCCONFIG_FILE)).toEqual(true);
    expect(paths.includes(PROPERTIES_FILE)).toEqual(true);
  });
  it.each`
    expected_path       | test_file
    ${D_TS_FILE}        | ${"index.d.ts"}
    ${JAVA_VALUES_PATH} | ${"ConfigValues.java"}
    ${H_VALUES_FILE}    | ${"ConfigValues.h"}
    ${XCCONFIG_FILE}    | ${"rnuc.xcconfig"}
    ${PROPERTIES_FILE}  | ${"rnuc.properties"}
  `("correct data for file $expected_path", ({ expected_path, test_file }) => {
    const data_path = path.join(__dirname, "outputs", test_file);
    const data = fs.readFileSync(data_path).toString();
    expect(map[expected_path]).toEqual(data);
  });
});
