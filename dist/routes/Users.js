"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const express_1 = require("express");
const MemberDao_mock_1 = __importDefault(require("@daos/Member/MemberDao.mock"));
const constants_1 = require("@shared/constants");
const router = express_1.Router();
const memberDao = new MemberDao_mock_1.default();
const { BAD_REQUEST, CREATED, OK } = http_status_codes_1.default;
/******************************************************************************
 *                      Get All Members - "GET /api/members/all"
 ******************************************************************************/
router.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const members = yield memberDao.getAll();
    return res.status(OK).json({ members });
}));
/******************************************************************************
 *                       Add One - "POST /api/members/add"
 ******************************************************************************/
router.post('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { member } = req.body;
    if (!member) {
        return res.status(BAD_REQUEST).json({
            error: constants_1.paramMissingError,
        });
    }
    yield memberDao.add(member);
    return res.status(CREATED).end();
}));
/******************************************************************************
 *                       Update - "PUT /api/members/update"
 ******************************************************************************/
router.put('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { member } = req.body;
    if (!member) {
        return res.status(BAD_REQUEST).json({
            error: constants_1.paramMissingError,
        });
    }
    member.id = Number(member.id);
    yield memberDao.update(member);
    return res.status(OK).end();
}));
/******************************************************************************
 *                    Delete - "DELETE /api/members/delete/:id"
 ******************************************************************************/
router.delete('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield memberDao.delete(Number(id));
    return res.status(OK).end();
}));
/******************************************************************************
 *                                     Export
 ******************************************************************************/
exports.default = router;
