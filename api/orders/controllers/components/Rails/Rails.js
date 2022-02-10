const Door =require( './designs/Door/Door');
const Custom =require( './designs/Door/Custom');
const Face_Frame =require( './designs/Face_Frame/Face_Frame');
const One_Piece_Door =require( './designs/One_Piece_Door/One_Piece_Door');
const Slab_Door =require( './designs/Slab_Door/Slab_Door');

const Rails = (info, part, breakdowns) => {


  if (info.orderType?.value === 'Door') {
    if (info.construction.value === 'Slab') {
      return Slab_Door(info);
    } else {
      if (info.construction?.value === 'Cope') {
       
        return Door(info, part, breakdowns[0]);
      }

      if (info.construction?.value === 'MT') {
        return Door(info, part, breakdowns[1]);
      }

      if (info.construction?.value === 'Miter') {
        return Door(info, part, breakdowns[2]);
      }
    }
  }

  if (info.orderType?.value === 'Custom') {
    return Custom(info, part);
  }

  if (info.orderType?.value === 'DF') {
    if (info.construction.value === 'Slab') {
      return Slab_Door(info);
    } else {
      if (info.construction?.value === 'Cope') {
        return Door(info, part, breakdowns[4]);
      }

      if (info.construction?.value === 'MT') {
        return Door(info, part, breakdowns[3]);
      }

      if (info.construction?.value === 'Miter') {
        return Door(info, part, breakdowns[5]);
      }
    }
  }

  if (info.orderType?.value === 'Face_Frame') {
    return Face_Frame(info, part, breakdowns[6]);
  }

  if (info.orderType?.value === 'One_Piece') {
    return One_Piece_Door(info, part, breakdowns[0]);
  }

  if (info.orderType?.value === 'One_Piece_DF') {
    return One_Piece_Door(info, part, breakdowns[0]);
  }

  if (info.orderType?.value === 'Two_Piece') {
    if (info.construction?.value === 'Cope') {
      return Door(info, part, breakdowns[0]);
    }

    if (info.construction?.value === 'MT') {
      return Door(info, part, breakdowns[1]);
    }

    if (info.construction?.value === 'Miter') {
      return Door(info, part, breakdowns[2]);
    }
  }

  if (info.orderType?.value === 'Two_Piece_DF') {
    if (info.construction?.value === 'Cope') {
      return Door(info, part, breakdowns[4]);
    }

    if (info.construction?.value === 'MT') {
      return Door(info, part, breakdowns[3]);
    }

    if (info.construction?.value === 'Miter') {
      return Door(info, part, breakdowns[5]);
    }
  } else {
    return [];
  }
};

module.exports = Rails
