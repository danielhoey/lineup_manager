class GamesController < ApplicationController
  def index
  end

  def create
  end

  def show
    @players = Player.active
  end

  def update
  end

  def destroy
  end
end
