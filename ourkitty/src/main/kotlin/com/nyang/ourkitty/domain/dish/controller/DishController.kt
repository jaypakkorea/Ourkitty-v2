package com.nyang.ourkitty.domain.dish.controller

import com.nyang.ourkitty.common.LocationCode
import com.nyang.ourkitty.common.UserCode
import com.nyang.ourkitty.common.dto.ResultDto
import com.nyang.ourkitty.domain.dish.dto.DishRequestDto
import com.nyang.ourkitty.domain.dish.dto.DishResponseDto
import com.nyang.ourkitty.domain.dish.service.DishService
import com.nyang.ourkitty.exception.CustomException
import com.nyang.ourkitty.exception.ErrorCode
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@Api(tags = ["냥그릇 관련 API"])
@RestController
@RequestMapping("/dish")
@CrossOrigin("*")
class DishController(
    private val dishService: DishService
) {

    private val testToken = mapOf(
        "clientId" to 1L,
        "userCode" to UserCode.지자체.code,
        "locationCode" to LocationCode.해운대구.code,
    )

    /**
     * 해당 유저가 관리하는 dish 의 목록을 반환한다.
     * TODO : 인증 기능 - 현재 로그인한 유저의 id 를 받아와서 (jwt 토큰 까서?) 전달해야함
     * @return ResponseEntity<List<DishResponseDto>>
     */
    @ApiOperation(value = "냥그릇 목록 조회")
    @GetMapping
    fun getDishList(@RequestParam limit: Long, @RequestParam offset: Long): ResponseEntity<ResultDto<List<DishResponseDto>>> {
        val dishList = dishService.getDishList(testToken["locationCode"].toString(), limit, offset)

        return ResponseEntity.ok(dishList)
    }

    /**
     * 입력으로 들어온 dishId 값을 기준으로 냥그릇을 조회한 뒤 반환한다.
     *
     * @param dishId Long
     * @return ResponseEntity<DishResponseDto>
     */
    @ApiOperation(value = "냥그릇 조회")
    @GetMapping("/{dishId}")
    fun getDish(@PathVariable("dishId") dishId: Long): ResponseEntity<ResultDto<DishResponseDto>> {
        return ResponseEntity.ok(dishService.getDish(dishId))
    }

    /**
     * 입력받은 dishRequestDto 의 정보를 바탕으로 새로운 냥그릇을 생성한 뒤,
     * exception 이 발생하지 않는다면 id 값을 return 한다.
     * swagger 에 @ApiParam 이라는 어노테이션도 존재
     * TODO : @RequestBody
     * @param dishRequestDto DishRequestDto
     * @return ResponseEntity<DishResponseDto>
     */
    @ApiOperation(value = "냥그릇 생성")
    @PostMapping
    fun createDish(
        dishRequestDto: DishRequestDto, @RequestParam(required = false) file: MultipartFile?
    ): ResponseEntity<ResultDto<DishResponseDto>> {

        if (testToken["userCode"].toString() != UserCode.지자체.code) {
            //TODO : 권한 없음
            throw CustomException(ErrorCode.NO_ACCESS)
        }
        return ResponseEntity.ok(dishService.createDish(dishRequestDto, file))
    }

    /**
     * 입력으로 들어온 dishId 와 일치하는 id 를 가진 냥그릇의 정보를
     * dishRequestDto 의 정보로 update 한다.
     * 업데이트가 성공적으로 완료되면, id 값을 반환한다.
     * TODO : @RequestBody
     * @param dishId Long
     * @param dishRequestDto DishRequestDto
     * @return ResponseEntity<DishResponseDto>
     */
    @ApiOperation(value = "냥그릇 수정")
    @PutMapping("/{dishId}")
    fun modifyDish(
        @PathVariable("dishId") dishId: Long, dishRequestDto: DishRequestDto, @RequestParam(required = false) file: MultipartFile?
    ): ResponseEntity<ResultDto<DishResponseDto>> {
        if (testToken["userCode"].toString() != UserCode.지자체.code) {
            //TODO : 권한 없음
            throw CustomException(ErrorCode.NO_ACCESS)
        }
        return ResponseEntity.ok(dishService.modifyDish(dishId, dishRequestDto, file))
    }

    /**
     * 입력으로 들어온 dishId 와 일치하는 id 를 가진 냥그릇의 isDeleted 를 true 로 바꾼다.
     *
     * @param dishId Long
     * @return ResponseEntity<Boolean>
     */
    @ApiOperation(value = "냥그릇 삭제")
    @DeleteMapping("/{dishId}")
    fun deleteDish(@PathVariable("dishId") dishId: Long): ResponseEntity<ResultDto<Boolean>> {
        if (testToken["userCode"].toString() != UserCode.지자체.code) {
            //TODO : 권한 없음
            throw CustomException(ErrorCode.NO_ACCESS)
        }
        return ResponseEntity.ok(dishService.deleteDish(dishId))
    }

}