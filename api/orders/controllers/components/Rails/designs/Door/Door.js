const Ratio =require( 'lb-ratio');
const numQty =require( 'numeric-quantity');

const fraction = (num) => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

const Door = (info, part, breakdowns) => {

  
  const vMidRail = info.verticalMidRailSize ? info.verticalMidRailSize : 0;
  const hMidRail = info.horizontalMidRailSize ? info.horizontalMidRailSize : 0;

  let edge_factor = info?.edge?.LIP_FACTOR ? info?.edge?.LIP_FACTOR : 0;
  let lip_factor = info?.edge?.LIP_FACTOR ? info?.edge?.LIP_FACTOR : 0;

  const topRail = info.topRail ? Math.round(numQty(info.topRail) * 16) / 16 + (lip_factor / 2) : 0;
  const bottomRail = info.bottomRail
    ? Math.round(numQty(info.bottomRail) * 16) / 16 + (lip_factor / 2)
    : 0;
  const leftStile = info.leftStile
    ? Math.round(numQty(info.leftStile) * 16) / 16 + (lip_factor / 2)
    : 0;
  const rightStile = info.rightStile
    ? Math.round(numQty(info.rightStile) * 16) / 16 + (lip_factor / 2)
    : 0;
  const vertMull = Math.round(numQty(vMidRail) * 16) / 16;
  const horizMull = Math.round(numQty(hMidRail) * 16) / 16;
  const panelsH = parseInt(info.panelsH);
  const panelsW = parseInt(info.panelsW);
  const height = Math.round(numQty(info.height) * 16) / 16;
  const width = Math.round(numQty(info.width) * 16) / 16;
  const qty = parseInt(info.qty);
  const item = parseInt(info.item);

  let inset = 0;
  if (info.profile) {
    inset = info.profile?.INSET;
  } else {
    inset = info.design?.INSET;
  }

  

  if (eval(breakdowns.topRail_width) === eval(breakdowns.bottomRail_width)) {
    if ((panelsW > 1 && panelsH > 1) || (panelsH > 1 && panelsW === 1)) {
      return [
        {
          qty: `(${qty * 2})`,
          qty_2: qty * 2,
          measurement: `${fraction(
            eval(breakdowns.topRail_width)
          )} x ${fraction(
            Math.round(eval(breakdowns.topRail_height) * 16) / 16
          )}`,
          pattern: 'TB',
          razor_pattern: 'T / B',
          width: eval(breakdowns.topRail_width),
          height: eval(breakdowns.topRail_height),
          multiplier: 2,
          item: item,
        },
        {
          qty: `(${(panelsH - 1) * qty})`,
          qty_2: (panelsH - 1) * qty,
          measurement: `${fraction(
            eval(breakdowns.horizontal_mid_rail_width)
          )} x ${fraction(
            Math.round(eval(breakdowns.horizontal_mid_rail_height) * 16) / 16
          )}`,
          pattern: 'HM',
          razor_pattern: 'H Mull',
          width: eval(breakdowns.horizontal_mid_rail_width),
          height: eval(breakdowns.horizontal_mid_rail_height),
          multiplier: panelsH - 1,
          item: item,
        },
      ];
    } else {
      return [
        {
          qty: `(${qty * 2})`,
          qty_2: qty * 2,
          measurement: `${fraction(
            eval(breakdowns.topRail_width)
          )} x ${fraction(
            Math.round(eval(breakdowns.topRail_height) * 16) / 16
          )}`,
          pattern: 'TB',
          razor_pattern: 'T / B',
          width: eval(breakdowns.topRail_width),
          height: eval(breakdowns.topRail_height),
          multiplier: 2,
          item: item,
        },
      ];
    }
  } else {
    if ((panelsW > 1 && panelsH > 1) || (panelsH > 1 && panelsW === 1)) {
      return [
        {
          qty: `(${qty})`,
          qty_2: qty,
          measurement: `${fraction(
            eval(breakdowns.topRail_width)
          )} x ${fraction(
            Math.round(eval(breakdowns.topRail_height) * 16) / 16
          )}`,
          pattern: 'T',
          razor_pattern: 'T',
          width: eval(breakdowns.topRail_width),
          height: eval(breakdowns.topRail_height),
          multiplier: 1,
          item: item,
        },
        {
          qty: `(${qty})`,
          qty_2: qty,
          measurement: `${fraction(
            eval(breakdowns.bottomRail_width)
          )} x ${fraction(
            Math.round(eval(breakdowns.bottomRail_height) * 16) / 16
          )}`,
          pattern: 'B',
          razor_pattern: 'B',
          width: eval(breakdowns.bottomRail_width),
          height: eval(breakdowns.bottomRail_height),
          multiplier: 1,
          item: item,
        },
        {
          qty: `(${(panelsH - 1) * qty})`,
          qty_2: (panelsH - 1) * qty,
          measurement: `${fraction(
            eval(breakdowns.horizontal_mid_rail_width)
          )} x ${fraction(
            Math.round(eval(breakdowns.horizontal_mid_rail_height) * 16) / 16
          )}`,
          pattern: 'HM',
          razor_pattern: 'H Mull',
          width: eval(breakdowns.horizontal_mid_rail_width),
          height: eval(breakdowns.horizontal_mid_rail_height),
          multiplier: panelsH - 1,
          item: item,
        },
      ];
    } else {
      return [
        {
          qty: `(${qty})`,
          qty_2: qty,
          measurement: `${fraction(
            eval(breakdowns.topRail_width)
          )} x ${fraction(
            Math.round(eval(breakdowns.topRail_height) * 16) / 16
          )}`,
          pattern: 'T',
          razor_pattern: 'T',
          width: eval(breakdowns.topRail_width),
          height: eval(breakdowns.topRail_height),
          multiplier: 1,
          item: item,
        },
        {
          qty: `(${qty})`,
          qty_2: qty,
          measurement: `${fraction(
            eval(breakdowns.bottomRail_width)
          )} x ${fraction(
            Math.round(eval(breakdowns.bottomRail_height) * 16) / 16
          )}`,
          pattern: 'B',
          razor_pattern: 'B',
          width: eval(breakdowns.bottomRail_width),
          height: eval(breakdowns.bottomRail_height),
          multiplier: 1,
          item: item,
        },
      ];
    }
  }
};

module.exports = Door;
