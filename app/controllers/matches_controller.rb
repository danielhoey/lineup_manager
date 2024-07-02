class MatchesController < ApplicationController
  def index
    @matches = Match.all
  end

  def create
    m = Match.create(params[:match].permit(:round, :opponent))
    render :json => m
  end

  def show
    if params[:round]
      @match = Match.where(round: params[:round]).first
    else
      @match = Match.where(id: params[:id]).first
    end
    raise ActiveRecord::RecordNotFound.new("Round #{params[:round]} not found") if @match.nil?
    @players = Player.active
  end

  def update
  end

  def destroy
    Match.delete(params[:id])
    render :json => params
  end
end