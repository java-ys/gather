import mainAppShared from './shared'
import { microAppName } from '@/libs/util'
import { genActiveRule } from "./appUtils";
import { appEntryMap } from "./registerApp/appEntry";

const apps = Object.keys(appEntryMap).map(name =>
  ({
    name,
    entry: appEntryMap[name],
    container: '#frame',
    activeRule: genActiveRule(`/${name}`),
    props: { shared: mainAppShared }
  })
)

export default apps;
