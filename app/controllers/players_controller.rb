class PlayersController < ApplicationController
  def index
  end

  def create
    p = Player.create(params[:player].permit(:first_name, :last_name, :number))
    render :json => p.to_json
  end
end
