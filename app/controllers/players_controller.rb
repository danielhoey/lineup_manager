class PlayersController < ApplicationController
  def index
  end

  def create
    render :json => params[:player]
  end
end
