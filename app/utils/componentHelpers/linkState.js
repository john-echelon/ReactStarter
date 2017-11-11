
const updateComponentState = (component, key, path, value) => {
  if (path) {
    const model = component.state[path];
    model[key] = value;
    component.setState({
      [path]: model,
    });
  } else {
    component.setState({
      [key]: value,
    });
  }
};

const updateArray = (component, key, path, itemId, keyValuePairs) => {
  const oldItems = path ? component.state[path][key] : component.state[key];
  return oldItems.map(item => {
    const itemRef = item;
    if (item.id === itemId) {
      Object.keys(keyValuePairs).forEach(propKey => {
        itemRef[propKey] = keyValuePairs[propKey];
      });
    }
    return itemRef;
  });
};

const createArrayHandler = (component, key, path, { itemId, itemProp }) => e => {
  const el = e.target;
  const value = el.type === 'checkbox' ? el.checked : el.value;
  // Revert to element id and name attributes if itemId and itemProp are not defined.
  const { id, name } = el;
  const arrayItemId = itemId || id;
  const arrayProp = itemProp || name;
  const newItems = updateArray(component, key, path, arrayItemId, { [arrayProp]: value });
  updateComponentState(component, key, path, newItems);
};

const createHandler = (component, key, path) => e => {
  const el = e.target;
  const value = el.type === 'checkbox' ? el.checked : el.value;
  updateComponentState(component, key, path, value);
};
/**
 *  Used to bind the form control value to a string type property on the component's state.
 */
export const linkState = (component, key, path) => createHandler(component, key, path);
/**
 *  Used to bind the form control value to a string type property in an array element on the component's state.
 */
export const linkArray = (component, key, path, { itemId, itemProp }) =>
  createArrayHandler(component, key, path, { itemId, itemProp });
/**
 *  Used to bind the selected select control value to a string type property on the component's state.
 */
export const linkSelect = (component, key, path) => selection => {
  updateComponentState(component, key, path, selection.value);
};

export const linkSelectArray = (component, key, path, id, name) => selection => {
  const value = updateArray(component, key, path, id, { [name]: selection.value });
  updateComponentState(component, key, path, value);
};
