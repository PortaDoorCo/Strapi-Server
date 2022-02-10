const numQty = require( 'numeric-quantity');
const Custom = (info, part) => {
  const item = parseInt(info.item);

  return info.Rails?.map((i) => {
    return {
      qty: `(${i.qty})`,
      qty_2: parseInt(i.qty),
      measurement: `${i.width} x ${i.length}`,
      pattern: i.position?.value,
      razor_pattern: i.position?.razor_pattern,
      width: Math.round(numQty(i.width) * 16) / 16,
      height: Math.round(numQty(i.length) * 16) / 16,
      multiplier: parseInt(i.qty),
      item: item,
    };
  });
};

module.exports = Custom;
