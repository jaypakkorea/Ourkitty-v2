package com.meyou.app.main

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil.setContentView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.meyou.app.R

class MainFragment : Fragment() {

    private var dishList = mutableListOf<ContentsMyDishList>()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val rootView = inflater.inflate(R.layout.fragment_main, container, false)

        dishList.add(
            ContentsMyDishList(
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUiNRqrAJKbWIZ-1Nl8tygN61EqmpRuveYzQ&usqp=CAU",
                "장군이네",
                "아이유정"
            )
        )
        dishList.add(
            ContentsMyDishList(
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUiNRqrAJKbWIZ-1Nl8tygN61EqmpRuveYzQ&usqp=CAU",
                "장군이네",
                "아이유정"
            )
        )
        dishList.add(
            ContentsMyDishList(
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUiNRqrAJKbWIZ-1Nl8tygN61EqmpRuveYzQ&usqp=CAU",
                "장군이네",
                "아이유정"
            )
        )
        dishList.add(
            ContentsMyDishList(
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUiNRqrAJKbWIZ-1Nl8tygN61EqmpRuveYzQ&usqp=CAU",
                "장군이네",
                "아이유정"
            )
        )

        val dishData = rootView.findViewById<RecyclerView>(R.id.rv)
        val dishAdapter = MyDishAdapter(requireContext(), dishList)
        dishData.adapter = dishAdapter
        dishData.layoutManager = LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)

        return rootView
    }

}