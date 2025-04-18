"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yearsRouter = void 0;
const express_1 = require("express");
const validarJWT_1 = require("../middlewares/validarJWT");
const years_1 = require("../controllers/years");
const yearsRouter = (0, express_1.Router)();
exports.yearsRouter = yearsRouter;
yearsRouter.use(validarJWT_1.validarJWT);
yearsRouter.get("/", years_1.getYears);
yearsRouter.post("/", years_1.registerYears);
yearsRouter.put("/", years_1.updateYears);
yearsRouter.get("/show_all_years", years_1.showYears);
yearsRouter.put("/delete_year", years_1.deleteYears);
