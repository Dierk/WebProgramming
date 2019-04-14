
test("observable-value", assert => {

    const obs = Observable("");

//  initial state
    assert.equals(obs.getValue(),  "");

//  subscribers get notified
    let found;
    obs.onChange(val => found = val);
    obs.setValue("firstValue");
    assert.equals(found,  "firstValue");

//  value is updated
    assert.equals(obs.getValue(),  "firstValue");

//  it still works when the receiver symbols changes
    const newRef = obs;
    newRef.setValue("secondValue");
    // listener updates correctly
    assert.equals(found,  "secondValue");

//  Attributes are isolated, no "new" needed
    const secondAttribute = Observable("");

//  initial state
    assert.equals(secondAttribute.getValue(),  "");

//  subscribers get notified
    let secondFound;
    secondAttribute.onChange(val => secondFound = val);
    secondAttribute.setValue("thirdValue");
    assert.equals(found,  "secondValue");
    assert.equals(secondFound,  "thirdValue");

//  value is updated
    assert.equals(secondAttribute.getValue(),  "thirdValue");

});
