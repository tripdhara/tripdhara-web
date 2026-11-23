import TravellerService from '@/core/Services/Admin/TravellerService.js';
import { HTTP_STATUS, RESPONSE_MESSAGES, STATUS } from '@/core/Constants/index.js';
import Controller from '@/core/Controllers/Controller.js';
import { z } from 'zod';
import { validate } from '@/core/Helpers/validation.js';
import AppError from '@/core/Helpers/AppError.js';

const travellerCreateSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  name: z.string().min(2),
  password: z.string().min(6).optional()
}).passthrough();

const travellerUpdateSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  name: z.string().min(2).optional(),
  status: z.enum(Object.values(STATUS)).optional(),
  address: z.any().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.any().optional(),
  designation: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().optional(),
  expertise: z.any().optional(),
  bloodGroup: z.string().optional(),
  medicalConditions: z.any().optional(),
  socialLinks: z.any().optional(),
  emergencyContacts: z.any().optional(),
  preferences: z.any().optional(),
  isVerified: z.boolean().optional()
}).passthrough();

/**
 * TravellerController (Admin Role)
 * Platform-wide administration of traveller accounts, identity lifecycle, and activity.
 */
class TravellerController extends Controller {

  // GET /admin/travellers
  async getTravellers(req) {
    try {
      const travellers = await TravellerService.getAllTravellers();
      return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.SUCCESS.FETCHED, { travellers });
    } catch (error) {
      if (error instanceof AppError) return this.error(error.statusCode, error.message);
      return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
    }
  }

  // GET /admin/travellers/:id
  async getTraveller(req, { params }) {
    try {
      const traveller = await TravellerService.getTravellerById(params.id);
      return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.SUCCESS.FETCHED, { traveller });
    } catch (error) {
      if (error instanceof AppError) return this.error(error.statusCode, error.message);
      return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
    }
  }

  // POST /admin/travellers/create
  async createTraveller(req) {
    try {
      const rawBody = req.payload || req.body || (typeof req.json === 'function' ? await req.json() : {});
      const { success, data, error } = validate(travellerCreateSchema, rawBody);
      
      if (!success) {
          throw new AppError(error, HTTP_STATUS.BAD_REQUEST);
      }

      const traveller = await TravellerService.createTraveller(data, req);
      return this.success(HTTP_STATUS.CREATED, RESPONSE_MESSAGES.SUCCESS.CREATED, { traveller });
    } catch (error) {
      if (error instanceof AppError) return this.error(error.statusCode, error.message);
      return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
    }
  }

  // PATCH /admin/travellers/:id/update
  async updateTraveller(req, { params }) {
    try {
      const rawBody = req.payload || req.body || (typeof req.json === 'function' ? await req.json() : {});
      const { success, data, error } = validate(travellerUpdateSchema, rawBody);
      
      if (!success) {
          throw new AppError(error, HTTP_STATUS.BAD_REQUEST);
      }

      const traveller = await TravellerService.updateTraveller(params.id, data, req);
      return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.TRAVELLER.UPDATED, { traveller });
    } catch (error) {
      if (error instanceof AppError) return this.error(error.statusCode, error.message);
      return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
    }
  }

  // DELETE /admin/travellers/:id/delete
  async deleteTraveller(req, { params }) {
    try {
      await TravellerService.deleteTraveller(params.id);
      return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.TRAVELLER.DELETED);
    } catch (error) {
      if (error instanceof AppError) return this.error(error.statusCode, error.message);
      return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
    }
  }
}

const travellerController = new TravellerController();
export default travellerController;
