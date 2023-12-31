package com.meyou.app.network_API

import com.meyou.app.network_API.Dish.DetailDishGetService
import com.meyou.app.network_API.Dish.DishListGetService
import com.meyou.app.network_API.Dish.GetDishImageService
import com.meyou.app.network_API.Login.LoginApiService
import com.meyou.app.network_API.Login.LoginGetToken
import com.meyou.app.network_API.User.UserDeleteService
import com.meyou.app.network_API.User.UserListGetService
import com.meyou.app.network_API.User.UserProfileModifyService
import com.meyou.app.network_API.User.UserProfileService
import com.meyou.app.network_API.management.*
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory


class RetrofitInstance(private val accessToken: String = "") {

    private val BASE_URL = "https://k8e2031.p.ssafy.io/api/"

    private val client = OkHttpClient.Builder()
        .addInterceptor { chain ->
            val newRequest = chain.request().newBuilder()
                .addHeader("Authorization", "Bearer ${accessToken}")
                .build()
            chain.proceed(newRequest)
        }
        .build()
    // 헤더에 토큰을 넣어야 되는 API
    private val retrofit = Retrofit.Builder()
        .client(client)
        .baseUrl(BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    // 헤더에 토큰을 않넣어도 되는 API
    private val retrofitWithoutToken = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    fun getPhoneCheckApi(): LoginApiService {
        return retrofitWithoutToken.create(LoginApiService::class.java)
    }

    fun getUserToken(): LoginGetToken {
        return retrofitWithoutToken.create(LoginGetToken::class.java)
    }

    fun getDishList(): DishListGetService {
        return retrofit.create(DishListGetService::class.java)
    }
    fun getDetailDish(): DetailDishGetService {
        return retrofit.create(DetailDishGetService::class.java)
    }
    fun getDishImage(): GetDishImageService {
        return retrofit.create(GetDishImageService::class.java)
    }

    fun postCreateManagement(): CreateManagementService {
        return retrofit.create(CreateManagementService::class.java)
    }

    fun postUploadImage(): Uploadimage {
        return retrofit.create(Uploadimage::class.java)
    }
    fun getReadManagement(): ReadManagementService {
        return retrofit.create(ReadManagementService::class.java)
    }
    fun getReadDetailManagement(): ReadDetailManagementService {
        return retrofit.create(ReadDetailManagementService::class.java)
    }
    fun postManagementComment(): CreateManagementCommentService {
        return retrofit.create(CreateManagementCommentService::class.java)
    }
    fun deleteManagementComment(): DeleteManagementCommentService {
        return retrofit.create(DeleteManagementCommentService::class.java)
    }
    fun deleteManagement(): DeleteManagementService {
        return retrofit.create(DeleteManagementService::class.java)
    }
    fun getUserList(): UserListGetService {
        return retrofit.create(UserListGetService::class.java)
    }

    fun deleteUser(): UserDeleteService {
        return retrofit.create(UserDeleteService::class.java)
    }

    fun uploadSingleImage(): UserProfileService {
        return retrofit.create(UserProfileService::class.java)
    }

    fun modifyProfile(): UserProfileModifyService {
        return retrofit.create(UserProfileModifyService::class.java)
    }
}

