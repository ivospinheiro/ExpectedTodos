import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import set from "can-set/src/set";
import connect from "can-connect";
import constructor from "can-connect/constructor/";
import constructorStore from "can-connect/constructor/store/";
import map from "can-connect/can/map/map";
import hydrate from "can-connect/can/constructor-hydrate/constructor-hydrate";
import dataUrl from "can-connect/data/url/";
import memoryCache from "can-connect/data/memory-cache/";
import realTime from "can-connect/real-time/";

const Todo = DefineMap.extend("Todo", {
  id: "number",
  task: "string",
  get _serialize() {
    return this.serialize();
  }
});

Todo.List = DefineList.extend("Todo.List",
  {
    "#": Todo,
    get _serialize() {
      return this.serialize();
    }
  }
);

Todo.algebra = new set.Algebra(set.props.id("id"), set.comparators.id("id"));

const cacheConnection = connect([memoryCache], {
  name: Todo.constructor.name,
  algebra: Todo.algebra
});

Todo.connection = connect([
  dataUrl,
  constructor,
  constructorStore,
  map,
  hydrate,
  realTime
], {
  Map: Todo,
  List: Todo.List,
  algebra: Todo.algebra,
  url: "/service/todos",
  cacheConnection: cacheConnection
});

export default Todo;
