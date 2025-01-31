import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gameService from '../../services/game';
import api from '../../services/api';

// 异步 actions
export const initializeGame = createAsyncThunk(
  'game/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gameService.initialize();
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePlayerPosition = createAsyncThunk(
  'game/updatePosition',
  async (position, { rejectWithValue }) => {
    try {
      const response = await api.user.updatePosition(position);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return position;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const useInventoryItem = createAsyncThunk(
  'game/useItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await gameService.useItem(itemId);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  players: new Map(),
  inventory: [],
  position: { x: 0, y: 0 },
  worldState: null,
  loading: false,
  error: null
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updatePlayers: (state, action) => {
      const { type, player, playerId } = action.payload;
      switch (type) {
        case 'add':
          state.players.set(player.id, player);
          break;
        case 'remove':
          state.players.delete(playerId);
          break;
        case 'update':
          if (state.players.has(player.id)) {
            state.players.set(player.id, { ...state.players.get(player.id), ...player });
          }
          break;
      }
    },
    
    updateInventory: (state, action) => {
      state.inventory = action.payload;
    },
    
    updatePosition: (state, action) => {
      state.position = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 初始化游戏
      .addCase(initializeGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeGame.fulfilled, (state, action) => {
        state.loading = false;
        state.worldState = action.payload.worldState;
        state.position = action.payload.position;
        // 其他游戏状态更新...
      })
      .addCase(initializeGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 更新位置
      .addCase(updatePlayerPosition.fulfilled, (state, action) => {
        state.position = action.payload;
      })

      // 使用物品
      .addCase(useInventoryItem.fulfilled, (state, action) => {
        state.inventory = action.payload.inventory;
      });
  }
});

export const {
  updatePlayers,
  updateInventory,
  updatePosition,
  clearError
} = gameSlice.actions;

export default gameSlice.reducer;