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
    const applied_moulds = await strapi.services.products_api.find(
      { _sort: 'Item:ASC' },
      "applied-profiles"
    );
    
    const designs = await strapi.services.products_api.find(
      { _sort: 'Item:ASC', _limit: 200 },
      "designs"
    );

    const mouldings = await strapi.services.products_api.find(
      { _sort: 'Item:ASC', _limit: 200 },
      "mouldings"
    );

    const edge_slabs = await strapi.services.products_api.find(
      ctx.query,
      "edge-slabs"
    );
    const edges = await strapi.services.products_api.find(
      { _sort: 'Item:ASC', _limit: 200 },
      "edges");
    const finishes = await strapi.services.products_api.find(
      { _sort: 'Item:ASC' },
      "finish"
    );
    const lites = await strapi.services.products_api.find(
      { _sort: 'Item:ASC' },
      "lites"
      );

    const mouldings_lengths = await strapi.services.products_api.find(
      ctx.query,
      "mouldings-lengths"
    );
    const moulding_material = await strapi.services.products_api.find(
      { _sort: 'Item:ASC' },
      "moulding-material"
    );

    const panels = await strapi.services.products_api.find(
      { _sort: 'Item:ASC', _limit: 200 },
       "panels");

    const profiles = await strapi.services.products_api.find(
      { _sort: 'Item:ASC', _limit: 200 },
      "profiles"
    );

    const face_frame_designs = await strapi.services.products_api.find(
      ctx.query,
      "face-frame-designs"
    );
    const face_frame_top_rails = await strapi.services.products_api.find(
      ctx.query,
      "face-frame-top-rail"
    );
    const face_frame_finishing = await strapi.services.products_api.find(
      ctx.query,
      "face-frame-finishing"
    );
    const furniture_feets = await strapi.services.products_api.find(
      ctx.query,
      "furniture-feet"
    );
    const box_bottom_thickness = await strapi.services.products_api.find(
      ctx.query,
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
    const box_notches = await strapi.services.products_api.find(
      ctx.query,
      "box-notch"
    );
    const box_thickness = await strapi.services.products_api.find(
      ctx.query,
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
    const box_scoops = await strapi.services.products_api.find(
      { _sort: 'Item:ASC' },
      "box-scoop"
    );

    const door_piece_number = await strapi.services.products_api.find(
      { _sort: 'Item:ASC' },
      "door-piece-number"
    );

    const data = {
      woodtypes: woodtypes,
      applied_profiles: applied_moulds,
      edge_slabs: edge_slabs,
      edges: edges,
      finish: finishes,
      lites: lites,
      mouldings_lengths: mouldings_lengths,
      moulding_material: moulding_material,
      panels: panels,
      profiles: profiles,
      face_frame_designs: face_frame_designs,
      face_frame_top_rail: face_frame_top_rails,
      face_frame_finishing,
      furniture_feet: furniture_feets,
      designs,
      mouldings,
      box_bottom_thickness: box_bottom_thickness,
      box_finish: box_finish,
      box_assembly: box_assembly,
      box_notch: box_notches,
      box_thickness: box_thickness,
      box_woodtypes: box_woodtypes,
      box_bottom_woodtypes: box_bottom_woodtypes,
      box_scoop: box_scoops,
      door_piece_number: door_piece_number
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
