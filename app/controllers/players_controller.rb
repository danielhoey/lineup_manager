class PlayersController < ApplicationController
  def index
    @players = Player.select('id, first_name, last_name, number')
  end

  def create
    p = Player.create(params[:player].permit(:first_name, :last_name, :number))
    render :json => p.to_json
  end

  def destroy
    p = Player.find(params[:id])
    p.delete
    render :json => {id: p.id, deleted: true}
  end
end
