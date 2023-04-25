from client import VcoRequestManager
import os
import json

client = VcoRequestManager("vco33-usvi1.velocloud.net")
##change values
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblV1aWQiOiJkYzQwYTVmMy1iYjI4LTQyNTItYTE1Yy0wYWZkZjg4MWZkM2QiLCJleHAiOjE2NjIyNDE4NjEwMDAsInV1aWQiOiIzODJlMzA1My1kNTgyLTExZTYtODJiNC0wYTRkZWY5ODA3NDgiLCJpYXQiOjE2MzA3MDU4Njh9.BZ_gslPiJF1f4dKzeSeuutCnXurHFiXfaWcnEImXCX4"

list_ents = [664, 631, 372, 261, 447, 565, 489, 325, 601, 268, 739, 557, 444, 545, 715, 414, 185, 205, 348, 775, 452, 221, 513, 204, 728, 206, 552, 156, 420, 520, 723, 516, 756, 183, 792, 470, 411, 218, 328, 328, 670, 638, 536, 78, 430, 208, 559, 797, 319, 675, 381, 435, 553, 566, 556, 666, 606, 543, 498, 402, 150, 207, 71, 401, 251, 418, 424, 582, 574, 762, 661, 468, 238, 707, 613, 190, 551, 277, 298, 133, 689, 673, 647, 335, 618, 667, 286, 365, 573, 750, 80, 64, 671, 799, 209, 585, 572, 244, 170, 473, 293, 642, 562, 243, 324, 405, 224, 554, 137, 296, 595, 346, 492, 755, 196, 569, 564, 245, 103, 439, 249, 356, 154, 619, 505, 433, 772, 366, 303, 336, 389, 340, 571, 375, 603, 222, 378, 123, 641, 200, 125, 84, 767, 369, 504, 624, 421, 384, 359, 128, 626, 306, 139, 236, 351, 35, 180, 471, 441, 458, 302, 415, 751, 390, 413, 589, 625, 672, 99, 400, 165, 459, 124, 436, 178, 496, 176, 140, 76, 491, 729, 563, 541, 454, 462, 283, 173, 347, 264, 578, 132, 649, 350, 615, 746, 515, 81, 494, 627, 695, 518, 113, 425, 327, 258, 742, 527, 214, 694, 560, 269, 179, 406, 495, 486, 171, 466, 567, 231, 586, 85, 311, 432, 596, 596, 542, 502, 731, 769, 453, 225, 524, 263, 223, 240, 550, 134, 691, 397, 460, 522, 503, 202, 662, 521, 291, 714, 519, 126, 614, 364, 487, 289, 361, 239, 287, 284, 315, 684, 246, 711, 193, 665, 100, 135, 213, 321, 431, 174, 189, 704, 164, 640, 640, 169, 512, 483, 210, 215]
poolId = 1

for enterprise in list_ents:
    handoffConfig = client.call_api_token("enterprise/getEnterpriseGatewayHandoff", { "enterpriseId":enterprise }, token)
    if handoffConfig != None:
        print("There is Handoff config for {}".format(enterprise))
