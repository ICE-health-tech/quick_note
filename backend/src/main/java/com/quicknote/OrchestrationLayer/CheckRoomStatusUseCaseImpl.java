package com.quicknote.OrchestrationLayer;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.quicknote.DataLayer.RoomEntity;
import com.quicknote.DataLayer.RoomRepository;

public class CheckRoomStatusUseCaseImpl implements CheckRoomStatusUseCase {
   
    @Autowired
    private RoomRepository roomRepository;
    @Override
    public boolean isRoomActive(String roomId){
        Optional<RoomEntity> room= Optional.ofNullable(roomRepository.findById(roomId).orElseThrow(()-> new RoomAlreadyExistsException(roomId)));
        if(room.isEmpty()){
            return false;
        }
        return true;
        
    }
}
