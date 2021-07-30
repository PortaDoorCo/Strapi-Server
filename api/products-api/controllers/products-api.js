"use strict";
const _ = require("lodash");
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
  async find(ctx) {

    console.log('query',ctx.query)

    const woodtypes = await strapi.services.products_api.find(
      ctx.query,
      "woodtypes"
    );
    const applied_profiles = await strapi.services.products_api.find(
      { _sort: 'id:ASC' },
      "applied-profiles"
    );
    
    const designs = await strapi.services.products_api.find(
      { _sort: 'id:ASC', _limit: 200 },
      "designs"
    );

    const mouldings = await strapi.services.products_api.find(
      { _sort: 'id:ASC', _limit: 200 },
      "mouldings"
    );

    const edge_slabs = await strapi.services.products_api.find(
      ctx.query,
      "edge-slabs"
    );
    const edges = await strapi.services.products_api.find(
      { _sort: 'id:ASC', _limit: 200 },
      "edges");
    const finish = await strapi.services.products_api.find(
      { _sort: 'id:ASC' },
      "finish"
    );
    const lites = await strapi.services.products_api.find(
      { _sort: 'id:ASC' },
      "lites"
      );

    const mouldings_lengths = await strapi.services.products_api.find(
      ctx.query,
      "mouldings-lengths"
    );
    const moulding_material = await strapi.services.products_api.find(
      { _sort: 'id:ASC' },
      "moulding-material"
    );

    const panels = await strapi.services.products_api.find(
      { _sort: 'id:ASC', _limit: 200 },
       "panels");

    const profiles = await strapi.services.products_api.find(
      { _sort: 'id:ASC', _limit: 200 },
      "profiles"
    );

    const face_frame_designs = await strapi.services.products_api.find(
      ctx.query,
      "face-frame-designs"
    );
    const face_frame_top_rail = await strapi.services.products_api.find(
      ctx.query,
      "face-frame-top-rail"
    );
    const face_frame_finishing = await strapi.services.products_api.find(
      ctx.query,
      "face-frame-finishing"
    );
    const furniture_feet = await strapi.services.products_api.find(
      ctx.query,
      "furniture-feet"
    );
    const box_bottom_thickness = await strapi.services.products_api.find(
      { _sort: 'id:ASC' },
      "box-bottom-thickness"
    );
    const box_finish = await strapi.services.products_api.find(
      ctx.query,
      "box-finish"
    );
    const box_assembly = await strapi.services.products_api.find(
      ctx.query,
      "box-assembly"
    );
    const box_notch = await strapi.services.products_api.find(
      ctx.query,
      "box-notch"
    );
    const box_thickness = await strapi.services.products_api.find(
      { _sort: 'id:ASC' },
      "box-thickness"
    );
    const box_woodtypes = await strapi.services.products_api.find(
      ctx.query,
      "box-woodtypes"
    );
    const box_bottom_woodtypes = await strapi.services.products_api.find(
      ctx.query,
      "box-bottom-woodtypes"
    );
    const box_scoop = await strapi.services.products_api.find(
      { _sort: 'id:ASC' },
      "box-scoop"
    );

    const door_piece_number = await strapi.services.products_api.find(
      { _sort: 'id:ASC' },
      "door-piece-number"
    );

    const data = {
      woodtypes,
      applied_profiles,
      edge_slabs,
      edges,
      finish,
      lites,
      mouldings_lengths,
      moulding_material,
      panels,
      profiles,
      face_frame_designs,
      face_frame_top_rail,
      face_frame_finishing,
      furniture_feet,
      designs,
      mouldings,
      box_bottom_thickness,
      box_finish,
      box_assembly,
      box_notch,
      box_thickness,
      box_woodtypes,
      box_bottom_woodtypes,
      box_scoop,
      door_piece_number
    };

    return data;
  },

  async getProducts(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.services.products_api.getProducts(
      ctx.query,
      id
    );

    return entity;
  },

  async updateProduct(ctx) {
    const { id, product } = ctx.params;
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.products_api.updateProduct(
        { id, product },
        data,
        {
          files,
        }
      );
    } else {
      entity = await strapi.services.products_api.updateProduct(
        { id, product },
        ctx.request.body
      );
    }
    strapi.emitToAllUsers("product_updated", ctx.params, entity);
    return entity;
  },

  async getSingleProduct(ctx) {
    const { id, product } = ctx.params;
    console.log('product', product)
    console.log('id', id)
    const entity = await strapi.services.products_api.getSingleProduct({ id, product });
    return entity
  },

  async addProduct(ctx) {
    const { id } = ctx.params;
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.products_api.addProduct(data, id, {
        files,
      });
    } else {
      entity = await strapi.services.products_api.addProduct(
        ctx.request.body,
        id
      );
    }
    strapi.emitToAllUsers("product_added", ctx.params, entity);
    return entity;
  },

  async deleteProduct(ctx) {
    const { id, product } = ctx.params;
    const entity = await strapi.services.products_api.deleteProduct({
      id,
      product,
    });
    strapi.emitToAllUsers("product_deleted", ctx.params, entity);
    return entity;
  },
};
